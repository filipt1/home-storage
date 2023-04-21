const pathModule = require("path");

const { app } = require("electron");

const { Menu, MenuItem, BrowserWindow } = require("electron");
const {
  showConfirmationDialog,
  showDisclaimer,
} = require("../interaction/dialogs");
const { showNotification } = require("../interaction/notifications");
const { DOWNLOAD_TITLE } = require("../constants");

async function lockedFileMenu(event, filename, sshClient, config) {
  const mnu = new Menu();

  const isDirectory = await sshClient.stat(filename).isDirectory;

  mnu.append(
    new MenuItem({
      label: "Download",
      async click() {
        let downloadResponse;

        isDirectory
          ? (downloadResponse = await sshClient.downloadDir(
              filename,
              pathModule.join(
                app.getPath("home"),
                config.homeLocal,
                pathModule.basename(filename)
              )
            ))
          : (downloadResponse = await sshClient.get(
              filename,
              pathModule.join(
                app.getPath("home"),
                config.homeLocal,
                pathModule.basename(filename)
              )
            ));

        showNotification(DOWNLOAD_TITLE, downloadResponse);
      },
    })
  );

  mnu.append(
    new MenuItem({
      label: "Delete",
      async click() {
        const NO_BUTTON = 1;
        const result = await showConfirmationDialog(
          "Confirm deletion",
          `Do you really want to delete ${filename}`
        );

        if (result.response === NO_BUTTON) return;

        isDirectory ? sshClient.rmdir(filename) : sshClient.delete(filename);

        app.emit("refresh-listed-files");
      },
    })
  );

  mnu.append(
    new MenuItem({
      label: "Unlock",
      click() {
        const DISCLAIMER_MSG = "Changes will be applied after app restart.";
        config.lockedFiles.pop(filename);

        app.emit("app:write-config");

        showDisclaimer(DISCLAIMER_MSG);
      },
    })
  );

  mnu.popup(BrowserWindow.fromWebContents(event.sender));
}

module.exports = lockedFileMenu;
