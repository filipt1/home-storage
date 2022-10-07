const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  MenuItem,
} = require("electron");

const pathModule = require("path");
const isDev = require("electron-is-dev");

const Client = require("ssh2-sftp-client");

require("@electron/remote/main").initialize();

const handlers = require("./handlers");
const config = require("./config");
const runSetup = require("./scanner");

let client;

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // nodeIntegration: true,
      // enableRemoteModule: true,
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

async function initializeConnection() {
  client = new Client();
  await handlers.connect(client, config);

  return {
    homeLocal: config.homeLocal,
    homeRemote: config.homeRemote,
  };
}

// ipcMain.on("initialize-sftp", async function (event) {
//   client = new Client();
//   handlers.connect(client, config);

//   event.reply("initialize-sftp-reply", {
//     homeLocal: config.homeLocal,
//     homeRemote: config.homeRemote,
//   });
// });

ipcMain.handle("initialize-sftp", initializeConnection);

ipcMain.handle("list-files", async (event, path) => {
  return await handlers.listFiles(client, path);
});

ipcMain.handle("pathModule-dirname", (event, path) => {
  return pathModule.dirname(path);
});

ipcMain.handle("dialog:upload-file", async (event, currentPath) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    defaultPath: app.getPath("documents"),
    properties: ["openFile"],
  });

  if (canceled) return;
  else
    handlers.uploadFile(
      client,
      filePaths[0],
      pathModule.join(currentPath, pathModule.basename(filePaths[0]))
    );
});

ipcMain.handle("dialog:upload-directory", async (event, currentPath) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    defaultPath: app.getPath("documents"),
    properties: ["openDirectory"],
  });

  if (canceled) return;
  else
    handlers.uploadDirectory(
      client,
      filePaths[0],
      pathModule.join(currentPath, pathModule.basename(filePaths[0]))
    );
});

ipcMain.handle("menu:remote-menu", async (event, currentPath, currentFile) => {
  const mnu = new Menu();

  mnu.append(
    new MenuItem({
      label: "Download",
      click() {
        currentFile.directory
          ? handlers.getDirectory(
              client,
              pathModule.join(currentPath, currentFile.name),
              pathModule.join(
                app.getPath("home"),
                config.homeLocal,
                currentFile.name
              )
            )
          : handlers.getFile(
              client,
              pathModule.join(currentPath, currentFile.name),
              pathModule.join(
                app.getPath("home"),
                config.homeLocal,
                currentFile.name
              )
            );
      },
    })
  );

  mnu.append(
    new MenuItem({
      label: "Delete",
      click() {
        currentFile.directory
          ? handlers.deleteDirectory(
              client,
              pathModule.join(currentPath, currentFile.name)
            )
          : handlers.deleteFile(
              client,
              pathModule.join(currentPath, currentFile.name)
            );
      },
    })
  );

  mnu.popup(BrowserWindow.fromWebContents(event.sender));
});

ipcMain.on(
  "move-file",
  async (event, { currentPath, newDir, file, goBack }) => {
    if (goBack)
      console.log(pathModule.join(pathModule.dirname(currentPath), file));
    else console.log(pathModule.join(currentPath, newDir, file));
    if (goBack)
      await handlers.rename(
        client,
        pathModule.join(currentPath, file),
        pathModule.join(pathModule.dirname(currentPath), file)
      );
    else
      await handlers.rename(
        client,
        pathModule.join(currentPath, file),
        pathModule.join(currentPath, newDir, file)
      );
  }
);

ipcMain.on("create-directory", async (event, currentPath, newDir) => {
  await handlers.createDirectory(client, pathModule.join(currentPath, newDir));
});

// ipcMain.on("list-files", async function (event, path) {
//   const res = await handlers.listFiles(client, path);
//   event.reply("list-files-reply", res);
// });

ipcMain.on("get-stats", async function (event, path) {
  const res = await handlers.getStats(client, path);
  event.reply("get-stats-reply", res);
});

// ipcMain.on("upload-file", async function (event, targetPath, dstPath) {
//   await handlers.uploadFile(client, targetPath, dstPath);
// });

ipcMain.on("download-file", async function (event, targetPath, dstPath) {
  await handlers.getFile(client, targetPath, dstPath);
});

// ipcMain.on("upload-directory", async function (event, targetPath, dstPath) {
//   await handlers.uploadDirectory(client, targetPath, dstPath);
// });

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

ipcMain.on("auto-setup", function (event) {
  runSetup((res) => {
    event.reply("auto-setup-reply", res);
  });
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
