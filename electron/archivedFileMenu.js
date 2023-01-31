const pathModule = require("path");

const { app, Menu, MenuItem, BrowserWindow } = require("electron");

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

  console.log(lastModified);

  mnu.append(
    new MenuItem({
      label: "Download",
      click() {
        sshClient.get(
          fullFilename,
          pathModule.join(
            app.getPath("home"),
            config.homeLocal,
            pathModule.basename(currentFile.filename)
          )
        );
      },
    })
  );

  mnu.append(
    new MenuItem({
      label: "Delete",
      click() {
        sshClient.delete(`${ARCHIVE_DIR}/${fileId}-${lastModified}`);
      },
    })
  );

  mnu.popup(BrowserWindow.fromWebContents(event.sender));
}

module.exports = archivedFileMenu;
