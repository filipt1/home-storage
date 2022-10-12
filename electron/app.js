const pathModule = require("path");
const { app, ipcMain, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

const SFTPDriver = require("./sftpDriver");

class App {
  constructor() {
    this.sftpDriver = new SFTPDriver();
    app.on("ready", this.createWindow);
    app.on("window-all-closed", function () {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
    app.on("activate", function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    this.initializeIpc();
  }

  initializeIpc() {
    ipcMain.handle("initialize-sftp", () =>
      this.sftpDriver.initializeConnection()
    );
    ipcMain.handle("list-files", (event, path) =>
      this.sftpDriver.listFiles(event, path)
    );
    ipcMain.handle("pathModule-dirname", (event, path) =>
      this.sftpDriver.getDirname(event, path)
    );
    ipcMain.handle("dialog:upload-file", async (event, currentPath) => {
      this.sftpDriver.uploadFileDialog(event, currentPath);
    });
    ipcMain.handle("dialog:upload-directory", async (event, currentPath) => {
      this.sftpDriver.uploadDirDialog(event, currentPath);
    });
    ipcMain.handle(
      "menu:remote-menu",
      async (event, currentPath, currentFile) => {
        this.sftpDriver.displayRemoteMenu(event, currentPath, currentFile);
      }
    );
    ipcMain.on(
      "move-file",
      async (event, { currentPath, newDir, file, goBack }) => {
        this.sftpDriver.moveFile(event, { currentPath, newDir, file, goBack });
      }
    );
    ipcMain.on("create-directory", async (event, currentPath, newDir) => {
      this.sftpDriver.createDirectory(event, currentPath, newDir);
    });
  }

  async createWindow() {
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
}

module.exports = App;
