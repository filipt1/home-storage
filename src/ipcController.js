// const pathModule = window.require("path");
// const os = window.require("os");

// const { ipcRenderer } = window.require("electron");

// const { app } = window.require("@electron/remote");

// // exports.listFiles = (path) => {
// //   let filesRaw;
// //   ipcRenderer.send("list-files", path);
// //   ipcRenderer.on("list-files-reply", (event, res) => {
// //     filesRaw = res.map((file) => {
// //       return {
// //         name: file.name,
// //         directory: file.type === "d",
// //       };
// //     });
// //   });

// //   return filesRaw;
// // };

// function parsePath(path) {
//   if (os.platform() === "win32") return path.replace("\\", "/");
//   return path;
// }

// exports.uploadFile = (targetFile, path, homeRemote) => {
//   ipcRenderer.send(
//     "upload-file",
//     pathModule.join(path, targetFile),
//     parsePath(pathModule.join(homeRemote, targetFile))
//   );
// };

// exports.downloadFile = (targetFile, path, homeLocal) => {
//   ipcRenderer.send(
//     "download-file",
//     parsePath(pathModule.join(path, targetFile)),
//     pathModule.join(app.getPath("home"), homeLocal, targetFile)
//   );
// };

// exports.uploadDirectory = (targetDir, path, homeRemote) => {
//   ipcRenderer.send(
//     "upload-directory",
//     pathModule.join(path, targetDir),
//     parsePath(pathModule.join(homeRemote, targetDir))
//   );
// };

// exports.downloadDirectory = (targetDir, path, homeLocal) => {
//   ipcRenderer.send(
//     "download-directory",
//     parsePath(pathModule.join(path, targetDir)),
//     pathModule.join(app.getPath("home"), homeLocal, targetDir)
//   );
// };

// exports.deleteFile = (targetFile, path) => {
//   ipcRenderer.send("delete-file", parsePath(pathModule.join(path, targetFile)));
// };

// exports.deleteDirectory = (targetDir, path) => {
//   ipcRenderer.send(
//     "delete-directory",
//     parsePath(pathModule.join(path, targetDir))
//   );
// };

// exports.createDirectory = (path) => {
//   ipcRenderer.send("create-directory", path);
// };

// exports.renamePath = (path, targetFile, targetPath) => {
//   ipcRenderer.send(
//     "rename-path",
//     parsePath(pathModule.join(path, targetFile)),
//     parsePath(targetPath)
//   );
// };

// exports.startAutoSetup = () => {
//   ipcRenderer.send("auto-setup");
//   ipcRenderer.on("auto-setup-reply", (event, res) => {
//     console.log(res);
//   });
// };
