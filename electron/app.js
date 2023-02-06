const pathModule = require("path");

const { app, ipcMain, BrowserWindow, dialog } = require("electron");

const isDev = require("electron-is-dev");

const SFTPDriver = require("./sftpDriver");
const runSetup = require("./scanner");
const { initializeArchive, getArchivedFile } = require("./archive.handler");
const { showNotification } = require("./notifications");
const { readConfig, writeConfig } = require("./config.handler");

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
        this.sftpDriver.displayRemoteMenu(
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
      let newConfig = config;
      newConfig.homeLocal = config.homeLocal ?? "/Downloads";
      newConfig.homeRemote = config.homeRemote ?? "";
      newConfig.archivedFiles = config.archivedFiles ?? [];
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
      console.log(fileId);
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

    if (!res) {
      dialog.showErrorBox(
        "Connection error",
        "Credentials provided in the config file are not valid! Run setup again!"
      );
      return;
    }

    app.emit("initialize-archive");
    return res;
  }
}

module.exports = App;
