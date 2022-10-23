const pathModule = require("path");
const { app, dialog } = require("electron");

const Client = require("ssh2-sftp-client");

const remoteMenu = require("./remoteMenu");

class SFTPDriver {
  sshClient = new Client();

  async initializeConnection(config) {
    try {
      if (this.sshClient.sftp) await this.sshClient.end();
      await this.sshClient.connect(config);
    } catch (err) {
      if (err.code === "ERR_BAD_AUTH") return false;
    }

    return true;
  }

  async disconnect() {
    await this.sshClient.end();
  }

  async listFiles(event, path) {
    try {
      return await this.sshClient.list(path);
    } catch (err) {
      console.error(err);
    }
  }

  getDirname(event, path) {
    return pathModule.dirname(path);
  }

  async uploadFileDialog(event, currentPath) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      defaultPath: app.getPath("documents"),
      properties: ["openFile"],
    });

    if (canceled) return;
    try {
      this.sshClient.put(
        filePaths[0],
        pathModule.join(currentPath, pathModule.basename(filePaths[0]))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async uploadDirDialog(event, currentPath) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      defaultPath: app.getPath("documents"),
      properties: ["openDirectory"],
    });

    if (canceled) return;
    try {
      this.sshClient.uploadDir(
        filePaths[0],
        pathModule.join(currentPath, pathModule.basename(filePaths[0]))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async displayRemoteMenu(event, currentPath, currentFile) {
    try {
      await remoteMenu(event, currentPath, currentFile, this.sshClient);
    } catch (err) {
      console.error(err);
    }
  }

  async moveFile(event, { currentPath, newDir, file, goBack }) {
    try {
      if (goBack)
        await this.sshClient.rename(
          pathModule.join(currentPath, file),
          pathModule.join(pathModule.dirname(currentPath), file)
        );
      else
        await this.sshClient.rename(
          pathModule.join(currentPath, file),
          pathModule.join(currentPath, newDir, file)
        );
    } catch (err) {
      console.error(err);
    }
  }

  async createDirectory(event, currentPath, newDir) {
    try {
      await this.sshClient.mkdir(pathModule.join(currentPath, newDir));
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = SFTPDriver;
