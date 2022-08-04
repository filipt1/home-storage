const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;

const { uploadFile, uploadDirectory } = require("../ipcController");

const displayLocalContextMenu = (e, file, path, homeRemote) => {
  const mnu = new Menu();

  console.log(homeRemote);

  mnu.append(
    new MenuItem({
      label: "Upload",
      click() {
        file.directory
          ? uploadDirectory(file.name, path, homeRemote)
          : uploadFile(file.name, path, homeRemote);
      },
    })
  );

  mnu.popup({ window: remote.getCurrentWindow() });
};

module.exports = displayLocalContextMenu;
