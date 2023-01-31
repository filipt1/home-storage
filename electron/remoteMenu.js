const pathModule = require("path");
const { app, Menu, MenuItem, BrowserWindow } = require("electron");
const { unarchiveFile } = require("./archive.handler");

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

  console.log(getNewFileID(config.archivedFiles));
  console.log(archived);
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
