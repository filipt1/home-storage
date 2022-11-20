const pathModule = require("path");
const fs = require("fs");

const {
  app,
  ipcMain,
  BrowserWindow,
  dialog,
  Notification,
} = require("electron");

const isDev = require("electron-is-dev");

const SFTPDriver = require("./sftpDriver");
const runSetup = require("./scanner");

const CONFIG_FILE = "config.json";

class App {
  CONFIG;
  UPLOAD_TITLE = "Upload completed";

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
    this.initializeIpc();
  }

  initializeIpc() {
    ipcMain.handle("app:initialize-app", async () => {
      const res = await this.readConfig();

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
        .then((res) => this.showUploadNotification(res));
    });

    ipcMain.handle("dialog:upload-directory", async (event, currentPath) => {
      this.sftpDriver
        .uploadDirDialog(event, currentPath)
        .then((res) => this.showUploadNotification(res));
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

    ipcMain.on(
      "move-file",
      async (event, { currentPath, newDir, file, goBack }) => {
        this.sftpDriver.moveFile(event, { currentPath, newDir, file, goBack });
      }
    );

    ipcMain.on("create-directory", async (event, currentPath, newDir) => {
      this.sftpDriver.createDirectory(event, currentPath, newDir);
    });

    ipcMain.handle("app:auto-setup", runSetup);

    ipcMain.on("app:create-config", (event, config) => {
      let newConfig = config;
      newConfig.homeLocal = config.homeLocal ? config.homeLocal : "./Downloads";
      newConfig.homeRemote = config.homeRemote ? config.homeRemote : ".";
      this.writeConfig(config);
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

  async readConfig() {
    return new Promise(function (resolve, reject) {
      fs.readFile(pathModule.join("config", CONFIG_FILE), (err, data) => {
        let jsonData;
        if (err) resolve(false);
        if (data) jsonData = JSON.parse(data);
        resolve(jsonData);
      });
    });
  }

  writeConfig(config) {
    fs.writeFile(
      pathModule.join("config", CONFIG_FILE),
      JSON.stringify(config),
      (err) => {
        if (err) console.log(err);
      }
    );
  }

  async initializeConnection() {
    const res = await this.sftpDriver.initializeConnection(this.CONFIG);

    if (!res) {
      dialog.showErrorBox(
        "Connection error",
        "Credentials provided in the config file are not valid! Run setup again!"
      );
    }
    return res;
  }

  showUploadNotification(msg) {
    if (!msg) return;
    new Notification({
      title: this.UPLOAD_TITLE,
      body: msg,
    }).show();
  }
}

module.exports = App;
