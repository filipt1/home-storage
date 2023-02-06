const pathModule = require("path");
const { app, Menu, MenuItem, BrowserWindow } = require("electron");
const { showNotification } = require("./notifications");

const DOWNLOAD_TITLE = "Download complete";

function getNewFileID(fileArray) {
  const id = fileArray.reduce(
    (acc, curr) => (acc < curr.id ? (acc = curr.id) : acc),
    0
  );

  return id + 1;
}

async function remoteMenu(event, currentPath, currentFile, sshClient, config) {
  const mnu = new Menu();
  const fullFilename = pathModule.join(currentPath, currentFile.name);
  const archived = config.archivedFiles.some(
    (file) => file.filename === fullFilename
  );

  mnu.append(
    new MenuItem({
      label: "Download",
      async click() {
        let downloadResponse;
        currentFile.directory
          ? (downloadResponse = await sshClient.downloadDir(
              fullFilename,
              pathModule.join(
                app.getPath("home"),
                config.homeLocal,
                currentFile.name
              )
            ))
          : (downloadResponse = await sshClient.get(
              fullFilename,
              pathModule.join(
                app.getPath("home"),
                config.homeLocal,
                currentFile.name
              )
            ));

        showNotification(DOWNLOAD_TITLE, downloadResponse);
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

  if (!archived && !currentFile.directory) {
    mnu.append(
      new MenuItem({
        label: "Archive",
        async click() {
          // if (archiveItemLabel === "Unarchive") {
          //   config.archivedFiles = config.archivedFiles.filter(
          //     (el) => el.filename !== fullFilename
          //   );
          //   console.log(currentFile);
          //   unarchiveFile(fullFilename);
          //   return;
          // }

          const stats = await sshClient.stat(fullFilename);
          config.archivedFiles.push({
            id: getNewFileID(config.archivedFiles),
            filename: fullFilename,
            lastModified: stats.modifyTime,
          });
        },
      })
    );
  }

  mnu.popup(BrowserWindow.fromWebContents(event.sender));
}

module.exports = remoteMenu;
