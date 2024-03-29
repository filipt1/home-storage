const pathModule = require("path");

const { app, Menu, MenuItem, BrowserWindow } = require("electron");

const { showNotification } = require("../interaction/notifications");
const {
  showConfirmationDialog,
  showDisclaimer,
} = require("../interaction/dialogs");
const { isLocked } = require("../handlers/encryption.handler");
const {
  LOCKED_OPERATIONS_MSG,
  DOWNLOAD_TITLE,
  ARCHIVE_DIR,
} = require("../constants");
const {
  archiveActivated,
  archiveFile,
} = require("../handlers/archive.handler");

function getNewFileID(fileArray) {
  const id = fileArray.reduce(
    (acc, curr) => (acc < curr.id ? (acc = curr.id) : acc),
    0
  );

  return id + 1;
}

async function remoteMenu(event, currentPath, currentFile, sshClient, config) {
  const mnu = new Menu();
  const fullFilename = pathModule.posix.join(currentPath, currentFile.name);
  const archived = config.archivedFiles.some(
    (file) => file.filename === fullFilename
  );
  const fileIsLocked = config.lockedFiles.includes(fullFilename);
  const isArchiveActivated = await archiveActivated(sshClient);

  mnu.append(
    new MenuItem({
      label: "Download",
      async click() {
        let downloadResponse;

        if (isLocked(currentPath, currentFile.name, config)) {
          showDisclaimer(LOCKED_OPERATIONS_MSG);
          return;
        }

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
      async click() {
        const NO_BUTTON = 1;
        const result = await showConfirmationDialog(
          "Confirm deletion",
          `Do you really want to delete ${fullFilename}`
        );

        if (result.response === NO_BUTTON) return;

        if (isLocked(currentPath, currentFile.name, config)) {
          showDisclaimer(LOCKED_OPERATIONS_MSG);
          return;
        }

        currentFile.directory
          ? sshClient.rmdir(fullFilename, true)
          : sshClient.delete(fullFilename);

        app.emit("refresh-listed-files");
      },
    })
  );

  if (!currentFile.directory) {
    mnu.append(
      new MenuItem({
        label: "Archive",
        enabled: !archived && isArchiveActivated,
        async click() {
          const stats = await sshClient.stat(fullFilename);
          const newFileID = getNewFileID(config.archivedFiles);
          archiveActivated(sshClient);

          config.archivedFiles.push({
            id: newFileID,
            filename: fullFilename,
            lastModified: stats.modifyTime,
          });

          try {
            sshClient.rcopy(
              fullFilename,
              `${ARCHIVE_DIR}/${newFileID}-${stats.modifyTime}`
            );
          } catch (err) {
            console.log(err);
          }

          app.emit("app:write-config");
        },
      })
    );
  }

  mnu.append(
    new MenuItem({
      label: "Lock",
      enabled: !fileIsLocked,
      click() {
        config.lockedFiles.push(fullFilename);
        app.emit("app:write-config");
      },
    })
  );

  mnu.popup(BrowserWindow.fromWebContents(event.sender));
}

module.exports = remoteMenu;
