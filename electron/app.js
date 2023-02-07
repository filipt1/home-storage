const pathModule = require("path");

const { app, ipcMain, BrowserWindow } = require("electron");

const isDev = require("electron-is-dev");

const SFTPDriver = require("./utils/sftpDriver");
const runSetup = require("./utils/scanner");

const {
  initializeArchive,
  getArchivedFile,
} = require("./handlers/archive.handler");
const { readConfig, writeConfig } = require("./handlers/config.handler");
const { isLocked, verifyPassword } = require("./handlers/encryption.handler");

const { showNotification } = require("./interaction/notifications");
const { showErrorDialog, showDisclaimer } = require("./interaction/dialogs");

const { ARCHIVE_DIR } = require("./constants");

const UPLOAD_TITLE = "Upload completed";

class App {
  CONFIG;

  constructor() {
    this.sftpDriver = new SFTPDriver();

    app.disableHardwareAcceleration();

    app.on("ready", this.createWindow);
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) this.createWindow();
    });
    app.on("quit", () => {
      writeConfig(this.CONFIG);
    });
    app.on("initialize-archive", () => {
      initializeArchive(this.sftpDriver, this.CONFIG);
    });

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
      this.sftpDriver
        .uploadFileDialog(event, currentPath)
        .then((res) => showNotification(UPLOAD_TITLE, res));
    });

    ipcMain.handle("dialog:upload-directory", async (event, currentPath) => {
      this.sftpDriver
        .uploadDirDialog(event, currentPath)
        .then((res) => showNotification(UPLOAD_TITLE, res));
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

    ipcMain.on("move-file", async (event, operationParams) => {
      this.sftpDriver.moveFile(event, operationParams);
    });

    ipcMain.on("create-directory", async (event, currentPath, newDir) => {
      this.sftpDriver.createDirectory(event, currentPath, newDir);
    });

    ipcMain.handle("app:auto-setup", runSetup);

    ipcMain.on("app:create-config", (event, config) => {
      const ERROR_TITLE = "Invalid input";
      const ERROR_MSG =
        "This directory name is restricted from use, because it is used for archive!";

      let newConfig = config;

      if (config.homeRemote === ARCHIVE_DIR) {
        showErrorDialog(ERROR_TITLE, ERROR_MSG);
        return;
      }

      newConfig.homeLocal = config.homeLocal ?? "/Downloads";
      newConfig.homeRemote = config.homeRemote ?? "./";
      newConfig.archivedFiles = config.archivedFiles ?? [];
      newConfig.lockedFiles = config.lockedFiles ?? [];

      writeConfig(config);
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

    ipcMain.handle("encryption:verify-password", (event, password) => {
      const ERROR_TITLE = "Invalid input";
      const ERROR_MSG = "The password is incorrect!";
      const isValid = verifyPassword(password, this.CONFIG);

      if (!isValid) showErrorDialog(ERROR_TITLE, ERROR_MSG);

      return isValid;
    });
  }

  createWindow() {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
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

    win.webContents.openDevTools();
  }

  async initializeConnection() {
    const res = await this.sftpDriver.initializeConnection(this.CONFIG);
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
