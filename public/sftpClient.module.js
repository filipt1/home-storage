const Client = require("ssh2-sftp-client");

class SFTPClient {
  constructor() {
    this.client = new Client();
  }

  async connect(config) {
    try {
      await this.client.connect(config);
    } catch (err) {
      console.error(err);
    }
  }

  async disconnect() {
    await this.client.end();
  }

  async listFiles(remotePath) {
    let res;
    try {
      res = await this.client.list(remotePath);
    } catch (err) {
      console.error(err);
    }

    return res;
  }

  async getCwd() {
    let res;
    try {
      res = await this.client.cwd();
    } catch (err) {
      console.error(err);
    }

    return res;
  }

  async getFile(remotePath, dstPath) {
    try {
      await this.client.get(remotePath, dstPath);
    } catch (err) {
      console.error(err);
    }
  }

  async uploadFile(targetPath, dstPath) {
    try {
      await this.client.put(targetPath, dstPath);
    } catch (err) {
      console.error(err);
    }
  }

  async deleteFile(remotePath) {
    try {
      await this.client.delete(remotePath);
    } catch (err) {
      console.log(err);
    }
  }

  async getStats(remotePath) {
    let res;
    try {
      res = await this.client.stat(remotePath);
    } catch (err) {
      console.error(err);
    }

    return res;
  }

  async getDirectory(remotePath, dstPath) {
    try {
      await this.client.downloadDir(remotePath, dstPath);
    } catch (err) {
      console.error(err);
    }
  }

  async uploadDirectory(targetPath, dstPath) {
    try {
      await this.client.uploadDir(targetPath, dstPath);
    } catch (err) {
      console.err(err);
    }
  }
}

module.exports = SFTPClient;
