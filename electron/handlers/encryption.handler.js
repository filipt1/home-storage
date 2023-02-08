const pathModule = require("path");
const bcrypt = require("bcryptjs");

function isLocked(path, filename, config) {
  return config.lockedFiles.includes(pathModule.join(path, filename));
}

async function verifyPassword(password, config) {
  return await bcrypt.compare(password, config.password);
}

async function encryptPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, 10);
}

module.exports = { isLocked, verifyPassword, encryptPassword };
