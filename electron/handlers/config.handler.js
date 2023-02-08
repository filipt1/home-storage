const fs = require("fs");
const pathModule = require("path");

const { CONFIG_DIR, CONFIG_FILE } = require("../constants");

async function readConfig() {
  return new Promise(function (resolve) {
    fs.readFile(pathModule.join(CONFIG_DIR, CONFIG_FILE), (err, data) => {
      let jsonData;

      if (err) {
        resolve(false);
        return;
      }
      if (data) jsonData = JSON.parse(data);
      if (!Object.keys(jsonData).length) resolve(false);
      resolve(jsonData);
    });
  });
}

async function writeConfig(config) {
  return new Promise(function (resolve) {
    fs.mkdir(CONFIG_DIR, () => {
      fs.writeFile(
        pathModule.join(CONFIG_DIR, CONFIG_FILE),
        JSON.stringify(config),
        (err) => {
          if (err) resolve(false);
          resolve(true);
        }
      );
    });
  });
}

function deleteConfig() {
  fs.unlink(pathModule.join(CONFIG_DIR, CONFIG_FILE), (err) => {
    if (err) console.error(err);
  });
}

module.exports = { readConfig, writeConfig, deleteConfig };
