const pathModule = require("path").posix;
const osPathModule = require("path");
const { app, dialog } = require("electron");

const Client = require("ssh2-sftp-client");

const remoteMenu = require("../menus/remoteMenu");
const archiveMenu = require("../menus/archiveMenu");
const archivedFileMenu = require("../menus/archivedFileMenu");
const lockedFileMenu = require("../menus/lockedFileMenu");
const { showErrorDialog } = require("../interaction/dialogs");

class SFTPDriver {
  sshClient = new Client();

  async initializeConnection(config, plainPassword) {
    try {
      if (this.sshClient.sftp) await this.sshClient.end();

      const modifiedConfig = { ...config };

      modifiedConfig.password = plainPassword;

      await this.sshClient.connect(modifiedConfig);
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
      if (err.code === "ERR_NOT_CONNECTED") return false;
      if (err.code === 2) {
        showErrorDialog("Error", `The ${path} file does not exist!`);
        return;
      }
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
      return await this.sshClient.put(
        filePaths[0],
        pathModule.join(currentPath, osPathModule.basename(filePaths[0]))
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
      return await this.sshClient.uploadDir(
        filePaths[0],
        pathModule.join(currentPath, osPathModule.basename(filePaths[0]))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async displayRemoteMenu(event, currentPath, currentFile, config) {
    try {
      remoteMenu(event, currentPath, currentFile, this.sshClient, config);

      return new Promise(function (resolve) {
        app.once("refresh-listed-files", () => resolve(true));
      });
    } catch (err) {
      console.error(err);
    }
  }

  async displayArchiveMenu(event, fileId, config) {
    try {
      await archiveMenu(event, fileId, this.sshClient, config);
    } catch (err) {
      console.log(err);
    }
  }

  async displayArchivedFileMenu(event, fileId, lastModified, config) {
    try {
      await archivedFileMenu(
        event,
        fileId,
        lastModified,
        this.sshClient,
        config
      );
    } catch (err) {
      console.log(err);
    }
  }

  async displayLockedFileMenu(event, filename, config) {
    try {
      await lockedFileMenu(event, filename, this.sshClient, config);
    } catch (err) {
      console.error(err);
    }
  }

  async copy(oldPath, newPath) {
    try {
      await this.sshClient.rcopy(oldPath, newPath);
    } catch (err) {
      if (err.code === "ERR_BAD_PATH") return;
      console.error(err);
    }
  }

  async delete(filepath) {
    try {
      await this.sshClient.delete(filepath);
    } catch (err) {
      console.log(err);
    }
  }

  async moveFile(event, { currentPath, newDir, file, goBack }) {
    const fullFilepath = pathModule.join(currentPath, file);
    try {
      if (goBack)
        await this.sshClient.rename(
          fullFilepath,
          pathModule.join(pathModule.dirname(currentPath), file)
        );
      else
        await this.sshClient.rename(
          fullFilepath,
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
      throw err;
    }
  }

  async getStats(event, path, file) {
    try {
      return await this.sshClient.stat(pathModule.join(path, file));
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = SFTPDriver;
