const { contextBridge, ipcRenderer } = require("electron");

API = {
  pathModuleDirname: (path) => ipcRenderer.invoke("pathModule-dirname", path),
  initializeConnection: () => ipcRenderer.invoke("initialize-sftp"),
  listFiles: (path) => ipcRenderer.invoke("list-files", path),
  showUploadFileDialog: (currentPath) =>
    ipcRenderer.invoke("dialog:upload-file", currentPath),
  showUploadDirDialog: (currentPath) =>
    ipcRenderer.invoke("dialog:upload-directory", currentPath),
  showRemoteContextMenu: (currentPath, currentFile) =>
    ipcRenderer.invoke("menu:remote-menu", currentPath, currentFile),
  moveFile: (currentPath, newDir, file, goBack) =>
    ipcRenderer.send("move-file", { currentPath, newDir, file, goBack }),
  createDirectory: (currentPath, newDir) =>
    ipcRenderer.send("create-directory", currentPath, newDir),
};

contextBridge.exposeInMainWorld("api", API);
