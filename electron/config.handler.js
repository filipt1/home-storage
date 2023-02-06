const fs = require("fs");
const pathModule = require("path");

const CONFIG_FILE = "config.json";

async function readConfig() {
  return new Promise(function (resolve, reject) {
    fs.readFile(pathModule.join("config", CONFIG_FILE), (err, data) => {
      let jsonData;
      if (err) resolve(false);
      if (data) jsonData = JSON.parse(data);
      resolve(jsonData);
    });
  });
}

function writeConfig(config) {
  fs.writeFile(
    pathModule.join("config", CONFIG_FILE),
    JSON.stringify(config),
    (err) => {
      if (err) console.log(err);
    }
  );
}

module.exports = { readConfig, writeConfig };
