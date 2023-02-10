const fs = require("fs");
const pathModule = require("path");

const { app } = require("electron");

const { CONFIG_DIR, CONFIG_FILE } = require("../constants");

const CONFIG_PATH = pathModule.join(
  app.getPath("userData"),
  CONFIG_DIR,
  CONFIG_FILE
);

async function readConfig() {
  return new Promise(function (resolve) {
    fs.readFile(CONFIG_PATH, (err, data) => {
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
    fs.mkdir(pathModule.join(app.getPath("userData"), CONFIG_DIR), () => {
      fs.writeFile(CONFIG_PATH, JSON.stringify(config), (err) => {
        if (err) resolve(false);
        resolve(true);
      });
    });
  });
}

function deleteConfig() {
  fs.unlink(CONFIG_PATH, (err) => {
    if (err) console.error(err);
  });
}

module.exports = { readConfig, writeConfig, deleteConfig };
