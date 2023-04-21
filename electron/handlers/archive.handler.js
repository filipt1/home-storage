const { app } = require("electron");

const { ARCHIVE_DIR } = require("../constants");
const { showErrorDialog } = require("../interaction/dialogs");

async function initializeArchive(sftpDriver, config) {
  const ERROR_TITLE = "Permission error";
  const ERROR_MSG = "Cannot create a directory for archive!";
  try {
    await sftpDriver.createDirectory(null, "", ARCHIVE_DIR);
  } catch (err) {
    showErrorDialog(ERROR_TITLE, ERROR_MSG);
    return;
  }
  const files = await sftpDriver.listFiles(null, ARCHIVE_DIR);

  if (files.length) saveModifiedFiles(sftpDriver, config);

  for (const file of config.archivedFiles) {
    archiveFile(sftpDriver, file);
  }
}

async function archiveActivated(sshClient) {
  try {
    await sshClient.stat(ARCHIVE_DIR);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return false;
    console.log(err);
  }
}

async function saveModifiedFiles(sftpDriver, config) {
  for (const file of config.archivedFiles) {
    const lastModified = await checkFileModification(sftpDriver, file);

    if (lastModified) {
      const fileIndex = config.archivedFiles.findIndex(
        (el) => el.id === file.id
      );

      config.archivedFiles[fileIndex].lastModified = lastModified;

      archiveFile(sftpDriver, file);
    }
  }
}

async function checkFileModification(sftpDriver, file) {
  const stats = await sftpDriver.getStats(null, "", file.filename);

  if (stats.modifyTime !== file.lastModified) return stats.modifyTime;
}

async function archiveFile(sftpDriver, file) {
  sftpDriver.copy(
    file.filename,
    `${ARCHIVE_DIR}/${file.id}-${file.lastModified}`
  );
}

async function unarchiveFile(sshClient, fileId, config) {
  const archivedFiles = await sshClient.list(ARCHIVE_DIR);

  const toBeUnarchived = archivedFiles.filter(
    (el) => el.name.split("-")[0] === fileId
  );

  for (const file of toBeUnarchived) {
    sshClient.delete(`${ARCHIVE_DIR}/${file.name}`);
  }

  config.archivedFiles = config.archivedFiles.filter((el) => el.id !== fileId);

  app.emit("app:write-config");
}

async function getArchivedFile(sftpDriver, fileId) {
  const archivedFiles = await sftpDriver.listFiles(null, ARCHIVE_DIR);

  const filteredFile = archivedFiles.filter(
    (el) => el.name.split("-")[0] === `${fileId}`
  );

  return filteredFile.map((el) => el.name);
}

module.exports = {
  initializeArchive,
  unarchiveFile,
  getArchivedFile,
  archiveActivated,
};
