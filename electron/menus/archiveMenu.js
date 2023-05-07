const { Menu, MenuItem, BrowserWindow } = require("electron");
const { unarchiveFile } = require("../handlers/archive.handler");
const { showDisclaimer } = require("../interaction/dialogs");

async function archiveMenu(event, fileId, sshClient, config) {
  const mnu = new Menu();

  mnu.append(
    new MenuItem({
      label: "Unarchive",
      async click() {
        const DISCLAIMER_MSG = "Successfully unarchived.";

        unarchiveFile(sshClient, fileId, config);

        showDisclaimer(DISCLAIMER_MSG);
      },
    })
  );

  mnu.popup(BrowserWindow.fromWebContents(event.sender));
}

module.exports = archiveMenu;
