const pathModule = require("path");
const { app, Menu, MenuItem, BrowserWindow } = require("electron");

const config = require("./config");
const handlers = require("./handlers/sftp.handlers");

async function remoteMenu(event, currentPath, currentFile) {
  const mnu = new Menu();

  mnu.append(
    new MenuItem({
      label: "Download",
      click() {
        currentFile.directory
          ? handlers.getDirectory(
              client,
              pathModule.join(currentPath, currentFile.name),
              pathModule.join(
                app.getPath("home"),
                config.homeLocal,
                currentFile.name
              )
            )
          : handlers.getFile(
              client,
              pathModule.join(currentPath, currentFile.name),
              pathModule.join(
                app.getPath("home"),
                config.homeLocal,
                currentFile.name
              )
            );
      },
    })
  );

  mnu.append(
    new MenuItem({
      label: "Delete",
      click() {
        currentFile.directory
          ? handlers.deleteDirectory(
              client,
              pathModule.join(currentPath, currentFile.name)
            )
          : handlers.deleteFile(
              client,
              pathModule.join(currentPath, currentFile.name)
            );
      },
    })
  );

  mnu.popup(BrowserWindow.fromWebContents(event.sender));
}

module.exports = remoteMenu;
