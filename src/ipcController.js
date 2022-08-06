const pathModule = window.require("path");

const { ipcRenderer } = window.require("electron");

const { app } = window.require("@electron/remote");

exports.uploadFile = (targetFile, path, homeRemote) => {
  ipcRenderer.send(
    "upload-file",
    pathModule.join(path, targetFile),
    pathModule.join(homeRemote, targetFile)
  );
};

exports.downloadFile = (targetFile, path, homeLocal) => {
  ipcRenderer.send(
    "download-file",
    pathModule.join(path, targetFile),
    pathModule.join(app.getPath("home"), homeLocal, targetFile)
  );
};

exports.uploadDirectory = (targetDir, path, homeRemote) => {
  ipcRenderer.send(
    "upload-directory",
    pathModule.join(path, targetDir),
    pathModule.join(homeRemote, targetDir)
  );
};

exports.downloadDirectory = (targetDir, path, homeLocal) => {
  ipcRenderer.send(
    "download-directory",
    pathModule.join(path, targetDir),
    pathModule.join(homeLocal, targetDir)
  );
};

exports.deleteFile = (targetFile, path) => {
  ipcRenderer.send("delete-file", pathModule.join(path, targetFile));
};

exports.deleteDirectory = (targetDir, path) => {
  ipcRenderer.send("delete-directory", pathModule.join(path, targetDir));
};

exports.createDirectory = (path) => {
  ipcRenderer.send("create-directory", path);
};
