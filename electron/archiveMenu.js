const { Menu, MenuItem, BrowserWindow } = require("electron");
const { unarchiveFile } = require("./archive.handler");

const ARCHIVE_DIR = "cloud-archive";

async function archiveMenu(event, fileId, sshClient, config) {
  const mnu = new Menu();
  const currentFile = config.archivedFiles.find((el) => el.id == fileId);

  mnu.append(
    new MenuItem({
      label: "Delete",
      click() {
        sshClient.delete(
          `${ARCHIVE_DIR}/${fileId}-${currentFile.lastModified}`
        );
      },
    })
  );

  mnu.append(
    new MenuItem({
      label: "Unarchive",
      async click() {
        unarchiveFile(sshClient, fileId, config);
      },
    })
  );

  mnu.popup(BrowserWindow.fromWebContents(event.sender));
}

module.exports = archiveMenu;
