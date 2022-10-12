const pathModule = require("path");
const { app, dialog } = require("electron");

const Client = require("ssh2-sftp-client");

const config = require("./config");
const handlers = require("./handlers/sftp.handlers");
const remoteMenu = require("./remoteMenu");

class SFTPDriver {
  sshClient = new Client();
  async initializeConnection() {
    await handlers.connect(this.sshClient, config);

    return {
      homeLocal: config.homeLocal,
      homeRemote: config.homeRemote,
    };
  }

  async listFiles(event, path) {
    return await handlers.listFiles(this.sshClient, path);
  }

  async getDirname(event, path) {
    return pathModule.dirname(path);
  }

  async uploadFileDialog(event, currentPath) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      defaultPath: app.getPath("documents"),
      properties: ["openFile"],
    });

    if (canceled) return;
    else
      handlers.uploadFile(
        this.sshClient,
        filePaths[0],
        pathModule.join(currentPath, pathModule.basename(filePaths[0]))
      );
  }

  async uploadDirDialog(event, currentPath) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      defaultPath: app.getPath("documents"),
      properties: ["openDirectory"],
    });

    if (canceled) return;
    else
      handlers.uploadDirectory(
        this.sshClient,
        filePaths[0],
        pathModule.join(currentPath, pathModule.basename(filePaths[0]))
      );
  }

  async displayRemoteMenu(event, currentPath, currentFile) {
    await remoteMenu(event, currentPath, currentFile);
  }

  async moveFile(event, { currentPath, newDir, file, goBack }) {
    if (goBack)
      console.log(pathModule.join(pathModule.dirname(currentPath), file));
    else console.log(pathModule.join(currentPath, newDir, file));
    if (goBack)
      await handlers.rename(
        this.sshClient,
        pathModule.join(currentPath, file),
        pathModule.join(pathModule.dirname(currentPath), file)
      );
    else
      await handlers.rename(
        this.sshClient,
        pathModule.join(currentPath, file),
        pathModule.join(currentPath, newDir, file)
      );
  }

  async createDirectory(event, currentPath, newDir) {
    await handlers.createDirectory(
      this.sshClient,
      pathModule.join(currentPath, newDir)
    );
  }
}

module.exports = SFTPDriver;
