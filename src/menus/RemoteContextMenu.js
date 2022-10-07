// const { remote } = window.require("electron");
// const { Menu, MenuItem } = remote;

// const {
//   downloadFile,
//   downloadDirectory,
//   deleteDirectory,
//   deleteFile,
// } = require("../ipcController");

// const displayRemoteContextMenu = (e, file, path, homeLocal) => {
//   const mnu = new Menu();

//   mnu.append(
//     new MenuItem({
//       label: "Download",
//       click() {
//         file.directory
//           ? downloadDirectory(file.name, path, homeLocal)
//           : downloadFile(file.name, path, homeLocal);
//       },
//     })
//   );

//   mnu.append(
//     new MenuItem({
//       label: "Delete",
//       click() {
//         file.directory
//           ? deleteDirectory(file.name, path)
//           : deleteFile(file.name, path);
//       },
//     })
//   );

//   mnu.popup({ window: remote.getCurrentWindow() });
// };

// module.exports = displayRemoteContextMenu;
