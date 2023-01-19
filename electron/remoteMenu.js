const pathModule = require("path");
const { app, Menu, MenuItem, BrowserWindow } = require("electron");

const config = require("./config");

async function remoteMenu(event, currentPath, currentFile, sshClient, config) {
  const mnu = new Menu();
  const fullFilename = pathModule.join(currentPath, currentFile.name);
  const archiveItemLabel = config.archivedFiles.some(
    (file) => file.filename === fullFilename
  )
    ? "Unarchive"
    : "Archive";

  mnu.append(
    new MenuItem({
      label: "Download",
      click() {
        currentFile.directory
          ? sshClient.downloadDir(
              fullFilename,
              pathModule.join(
                app.getPath("home"),
                config.homeLocal,
                currentFile.name
              )
            )
          : sshClient.get(
              fullFilename,
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
          ? sshClient.rmdir(fullFilename)
          : sshClient.delete(fullFilename);
      },
    })
  );

  mnu.append(
    new MenuItem({
      label: archiveItemLabel,
      async click() {
        if (archiveItemLabel === "Unarchive") {
          config.archivedFiles = config.archivedFiles.filter(
            (el) => el.filename !== fullFilename
          );
          return;
        }

        const stats = await sshClient.stat(fullFilename);
        config.archivedFiles.push({
          filename: fullFilename,
          lastModified: stats.modifyTime,
        });
      },
    })
  );

  mnu.popup(BrowserWindow.fromWebContents(event.sender));
}

module.exports = remoteMenu;
