const { Menu, MenuItem, BrowserWindow } = require("electron");
const { unarchiveFile } = require("../handlers/archive.handler");
const { showConfirmationDialog } = require("../interaction/dialogs");

const ARCHIVE_DIR = "cloud-archive";

async function archiveMenu(event, fileId, sshClient, config) {
  const mnu = new Menu();
  const currentFile = config.archivedFiles.find((el) => el.id == fileId);

  // mnu.append(
  //   new MenuItem({
  //     label: "Delete",
  //     async click() {
  //       const YES_BUTTON = 0;

  //       const result = await showConfirmationDialog(
  //         "Confirm deletion",
  //         `Do you really want to delete all versions of ${currentFile.filename}`
  //       );

  //       if (result.response === YES_BUTTON)
  //         sshClient.delete(
  //           `${ARCHIVE_DIR}/${fileId}-${currentFile.lastModified}`
  //         );
  //     },
  //   })
  // );

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
