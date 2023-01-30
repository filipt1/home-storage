const ARCHIVE_DIR = "cloud-archive";

async function initializeArchive(sftpDriver, config) {
  sftpDriver.createDirectory(null, "", ARCHIVE_DIR);
  const files = await sftpDriver.listFiles(null, ARCHIVE_DIR);

  if (files.length) saveModifiedFiles(sftpDriver, config);

  for (const file of config.archivedFiles) {
    archiveFile(sftpDriver, file);
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

async function unarchiveFile(sftpDriver, filename) {
  const archivedFiles = await sftpDriver.listFiles(null, ARCHIVE_DIR);

  const toBeUnarchived = archivedFiles.filter((el) => el.name === filename);
  console.log(toBeUnarchived);
}

module.exports = {
  initializeArchive,
  unarchiveFile,
};
