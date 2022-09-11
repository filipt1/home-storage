const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

const Client = require("ssh2-sftp-client");

require("@electron/remote/main").initialize();

const handlers = require("./handlers");
const config = require("./config");

let client;

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  win.webContents.openDevTools();
}

ipcMain.on("initialize-sftp", async function (event) {
  client = new Client();
  handlers.connect(client, config);

  event.reply("initialize-sftp-reply", {
    homeLocal: config.homeLocal,
    homeRemote: config.homeRemote,
  });
});

ipcMain.on("list-files", async function (event, path) {
  const res = await handlers.listFiles(client, path);
  event.reply("list-files-reply", res);
});

ipcMain.on("get-stats", async function (event, path) {
  const res = await handlers.getStats(client, path);
  event.reply("get-stats-reply", res);
});

ipcMain.on("upload-file", async function (event, targetPath, dstPath) {
  await handlers.uploadFile(client, targetPath, dstPath);
});

ipcMain.on("download-file", async function (event, targetPath, dstPath) {
  await handlers.getFile(client, targetPath, dstPath);
});

ipcMain.on("upload-directory", async function (event, targetPath, dstPath) {
  await handlers.uploadDirectory(client, targetPath, dstPath);
});

ipcMain.on("download-directory", async function (event, targetPath, dstPath) {
  await handlers.getDirectory(client, targetPath, dstPath);
});

ipcMain.on("delete-file", async function (event, path) {
  await handlers.deleteFile(client, path);
});

ipcMain.on("delete-directory", async function (event, path) {
  await handlers.deleteDirectory(client, path);
});

ipcMain.on("create-directory", async function (event, path) {
  await handlers.createDirectory(client, path);
});

ipcMain.on("rename-path", async function (event, path, targetPath) {
  await handlers.rename(client, path, targetPath);
});

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
