const { contextBridge, ipcRenderer } = require("electron");

const API = {
  pathModuleDirname: (path) => ipcRenderer.invoke("pathModule-dirname", path),

  initializeConnection: () => ipcRenderer.invoke("app:initialize-sftp"),

  initializeApp: () => ipcRenderer.invoke("app:initialize-app"),

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

  runAutoSetup: () => ipcRenderer.invoke("app:auto-setup"),

  createConfig: (config) => ipcRenderer.invoke("app:create-config", config),

  getArchivedFile: (fileId) => ipcRenderer.invoke("get-archived-file", fileId),

  showArchiveMenu: (fileId) => ipcRenderer.invoke("menu:archive-menu", fileId),

  showArchivedFileMenu: (fileId, lastModified) =>
    ipcRenderer.invoke("menu:archived-file-menu", fileId, lastModified),

  isLocked: (path, filename) =>
    ipcRenderer.invoke("encryption:is-locked", path, filename),

  verifyPassword: (password) =>
    ipcRenderer.invoke("encryption:verify-password", password),

  showLockedFileMenu: (filename) =>
    ipcRenderer.invoke("menu:locked-file-menu", filename),

  logout: () => ipcRenderer.send("app:logout"),
};

contextBridge.exposeInMainWorld("api", API);
