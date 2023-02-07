const fs = require("fs");
const pathModule = require("path");

const { CONFIG_DIR, CONFIG_FILE } = require("../constants");

async function readConfig() {
  return new Promise(function (resolve) {
    fs.readFile(pathModule.join(CONFIG_DIR, CONFIG_FILE), (err, data) => {
      let jsonData;
      if (err) resolve(false);
      if (data) jsonData = JSON.parse(data);
      resolve(jsonData);
    });
  });
}

function writeConfig(config) {
  fs.writeFile(
    pathModule.join(CONFIG_DIR, CONFIG_FILE),
    JSON.stringify(config),
    (err) => {
      if (err) console.log(err);
    }
  );
}

module.exports = { readConfig, writeConfig };
