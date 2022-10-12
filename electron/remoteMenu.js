const pathModule = require("path");
const { app, Menu, MenuItem, BrowserWindow } = require("electron");

const config = require("./config");

async function remoteMenu(event, currentPath, currentFile, sshClient) {
  const mnu = new Menu();

  mnu.append(
    new MenuItem({
      label: "Download",
      click() {
        currentFile.directory
          ? sshClient.downloadDir(
              pathModule.join(currentPath, currentFile.name),
              pathModule.join(
                app.getPath("home"),
                config.homeLocal,
                currentFile.name
              )
            )
          : sshClient.get(
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
          ? sshClient.rmdir(pathModule.join(currentPath, currentFile.name))
          : sshClient.delete(pathModule.join(currentPath, currentFile.name));
      },
    })
  );

  mnu.popup(BrowserWindow.fromWebContents(event.sender));
}

module.exports = remoteMenu;
