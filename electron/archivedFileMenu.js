const pathModule = require("path");

const { app, Menu, MenuItem, BrowserWindow } = require("electron");
const { showNotification } = require("./notifications");
const { showConfirmationDialog } = require("./dialogs");

const ARCHIVE_DIR = "cloud-archive";

async function archivedFileMenu(
  event,
  fileId,
  lastModified,
  sshClient,
  config
) {
  const mnu = new Menu();
  const currentFile = config.archivedFiles.find((el) => el.id == fileId);
  const fullFilename = pathModule.join(
    ARCHIVE_DIR,
    `${fileId}-${lastModified}`
  );

  mnu.append(
    new MenuItem({
      label: "Download",
      async click() {
        let downloadResponse;

        downloadResponse = await sshClient.get(
          fullFilename,
          pathModule.join(
            app.getPath("home"),
            config.homeLocal,
            pathModule.basename(currentFile.filename)
          )
        );

        showNotification("Download completed", downloadResponse);
      },
    })
  );

  mnu.append(
    new MenuItem({
      label: "Delete",
      async click() {
        const YES_BUTTON = 0;
        const result = await showConfirmationDialog(
          "Confirm deletion",
          `Do you really want to delete this version of ${currentFile.filename}`
        );

        if (result.response === YES_BUTTON)
          sshClient.delete(`${ARCHIVE_DIR}/${fileId}-${lastModified}`);
      },
    })
  );

  mnu.popup(BrowserWindow.fromWebContents(event.sender));
}

module.exports = archivedFileMenu;
