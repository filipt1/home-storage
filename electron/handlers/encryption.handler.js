const pathModule = require("path");

function isLocked(path, filename, config) {
  return config.lockedFiles.includes(pathModule.join(path, filename));
}

function verifyPassword(password, config) {
  return config.password === password;
}

module.exports = { isLocked, verifyPassword };
