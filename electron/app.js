const pathModule = require("path");

const { app, ipcMain, BrowserWindow } = require("electron");

const isDev = require("electron-is-dev");

const SFTPDriver = require("./utils/sftpDriver");
const runSetup = require("./utils/scanner");

const {
  readConfig,
  writeConfig,
  deleteConfig,
} = require("./handlers/config.handler");
const {
  isLocked,
  verifyPassword,
  encryptPassword,
} = require("./handlers/encryption.handler");
const {
  initializeArchive,
  getArchivedFile,
} = require("./handlers/archive.handler");

const { showNotification } = require("./interaction/notifications");
const { showErrorDialog, showDisclaimer } = require("./interaction/dialogs");

const {
  ARCHIVE_DIR,
  LOCKED_OPERATIONS_MSG,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  SHOW_DEV_TOOLS,
} = require("./constants");
const createApplicationMenu = require("./menus/applicationMenu");

const UPLOAD_TITLE = "Upload completed";

class App {
  CONFIG = {};

  constructor() {
    this.sftpDriver = new SFTPDriver();

    app.disableHardwareAcceleration();

    app.on("ready", createApplicationMenu);
    app.on("ready", this.createWindow);

    app.on("will-quit", () => this.sftpDriver.disconnect());

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) this.createWindow();
    });
    app.on("initialize-archive", () => {
      initializeArchive(this.sftpDriver, this.CONFIG);
    });
    app.on("app:delete-config", () => {
      this.CONFIG = {};
      app.emit("app:write-config");
    });

    app.on("app:write-config", () => writeConfig(this.CONFIG));

    this.initializeIpc();
  }

  initializeIpc() {
    ipcMain.handle("app:initialize-app", async () => {
      const res = await readConfig();

      if (res) this.CONFIG = res;
      return res;
    });

    ipcMain.handle("app:initialize-sftp", async () => {
      return await this.initializeConnection();
    });

    ipcMain.handle("list-files", (event, path) =>
      this.sftpDriver.listFiles(event, path)
    );

    ipcMain.handle("pathModule-dirname", (event, path) =>
      this.sftpDriver.getDirname(event, path)
    );

    ipcMain.handle("dialog:upload-file", async (event, currentPath) => {
      const res = await this.sftpDriver.uploadFileDialog(event, currentPath);
      showNotification(UPLOAD_TITLE, res);
      return res;
    });

    ipcMain.handle("dialog:upload-directory", async (event, currentPath) => {
      const res = await this.sftpDriver.uploadDirDialog(event, currentPath);
      showNotification(UPLOAD_TITLE, res);
      return res;
    });

    ipcMain.handle(
      "menu:remote-menu",
      async (event, currentPath, currentFile) => {
        return await this.sftpDriver.displayRemoteMenu(
          event,
          currentPath,
          currentFile,
          this.CONFIG
        );
      }
    );

    ipcMain.on(
      "move-file",
      async (event, { currentPath, newDir, file, goBack }) => {
        if (isLocked(currentPath, file, this.CONFIG)) {
          showDisclaimer(LOCKED_OPERATIONS_MSG);
          return;
        }

        this.sftpDriver.moveFile(event, { currentPath, newDir, file, goBack });
      }
    );

    ipcMain.on("create-directory", async (event, currentPath, newDir) => {
      try {
        this.sftpDriver.createDirectory(event, currentPath, newDir);
      } catch (err) {
        console.log(err);
      }
    });

    ipcMain.handle("app:auto-setup", runSetup);

    ipcMain.handle("app:create-config", async (event, config) => {
      const ERROR_TITLE = "Invalid input";
      const ERROR_MSG_1 =
        "This directory name is restricted from use, because it is used for archive!";
      const ERROR_MSG_2 = "Please fill in all of the fields";

      let newConfig = { ...config };

      if (config.homeRemote === ARCHIVE_DIR) {
        showErrorDialog(ERROR_TITLE, ERROR_MSG_1);
        return;
      }

      if (!config.hostname || !config.username || !config.password) {
        showErrorDialog(ERROR_TITLE, ERROR_MSG_2);
        return;
      }

      newConfig.password =
        this.CONFIG.password ?? (await encryptPassword(config.password));
      newConfig.homeLocal = config.homeLocal ?? "/Downloads";
      newConfig.homeRemote = config.homeRemote ?? ".";
      newConfig.archivedFiles = config.archivedFiles ?? [];
      newConfig.lockedFiles = config.lockedFiles ?? [];
      this.plainPassword = this.plainPassword ?? config.password;

      showNotification(
        "Success",
        "Configuration file has been successfully created!"
      );

      return await writeConfig(newConfig);
    });

    ipcMain.handle("get-archived-file", (event, fileId) => {
      return getArchivedFile(this.sftpDriver, fileId);
    });

    ipcMain.handle("menu:archive-menu", (event, fileId) =>
      this.sftpDriver.displayArchiveMenu(event, fileId, this.CONFIG)
    );

    ipcMain.handle("menu:archived-file-menu", (event, fileId, lastModified) => {
      this.sftpDriver.displayArchivedFileMenu(
        event,
        fileId,
        lastModified,
        this.CONFIG
      );
    });

    ipcMain.handle("encryption:is-locked", (event, path, filename) => {
      const DISCLAIMER_MSG =
        "This file is locked, to enable operations with this file enter password.";
      const fileIsLocked = isLocked(path, filename, this.CONFIG);

      if (fileIsLocked) showDisclaimer(DISCLAIMER_MSG);

      return fileIsLocked;
    });

    ipcMain.handle("encryption:verify-password", async (event, password) => {
      const ERROR_TITLE = "Invalid input";
      const ERROR_MSG = "The password is incorrect!";
      const isValid = await verifyPassword(password, this.CONFIG);

      if (!isValid) showErrorDialog(ERROR_TITLE, ERROR_MSG);
      if (isValid) this.plainPassword = password;

      return isValid;
    });

    ipcMain.handle("menu:locked-file-menu", (event, filename) => {
      this.sftpDriver.displayLockedFileMenu(event, filename, this.CONFIG);
    });

    ipcMain.on("app:logout", (event) => {
      deleteConfig();
      app.emit("app:delete-config");
      event.sender.loadURL("http://localhost:3000");
    });
  }

  createWindow() {
    const win = new BrowserWindow({
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      webPreferences: {
        contextIsolation: true,
        preload: pathModule.join(__dirname, "preload.js"),
      },
    });

    win.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${pathModule.join(__dirname, "../build/index.html")}`
    );

    if (SHOW_DEV_TOOLS) win.webContents.openDevTools();
  }

  async initializeConnection() {
    const res = await this.sftpDriver.initializeConnection(
      this.CONFIG,
      this.plainPassword
    );
    const ERROR_TITLE = "Connection error";
    const ERROR_MSG =
      "Credentials provided in the config file are not valid! Run setup again!";

    if (!res) {
      showErrorDialog(ERROR_TITLE, ERROR_MSG);
      return;
    }

    app.emit("initialize-archive");

    return res;
  }
}

module.exports = App;
