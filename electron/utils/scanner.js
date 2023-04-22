const net = require("net");
const os = require("os");

const {
  SCANNER_START,
  SCANNER_END,
  LOCALHOST,
  SSH_PORT,
  SCAN_LOCALHOST,
} = require("../constants");

const TIMEOUT = 500;
const IS_DEV = true;

const Socket = net.Socket;

async function checkAddress(address) {
  const socket = new Socket();

  return new Promise(function (resolve) {
    let error = null;
    let status = null;
    let connectionRefused = false;

    socket.setTimeout(TIMEOUT);
    socket.on("timeout", function () {
      status = false;
      error = new Error("Timeout 500ms");
      socket.destroy();
    });

    socket.on("connect", function () {
      status = true;
      socket.destroy();
    });

    socket.on("error", function (err) {
      if (err.name !== "ECONNREFUSED") error = err;
      else connectionRefused = true;
      status = false;
    });

    socket.on("close", function (err) {
      resolve({ status });
    });

    socket.connect(SSH_PORT, address);
  });
}

function getAddressSpace() {
  const networkInterfaces = os.networkInterfaces();
  const splitAddress = networkInterfaces.en0[1].address.split(".");
  splitAddress.pop();
  const baseAddress = splitAddress.join(".");

  return baseAddress;
}

async function runSetup() {
  const addressSpace = getAddressSpace();
  const possibleAddresses = [];

  if (SCAN_LOCALHOST) {
    const res = await checkAddress(LOCALHOST);
    if (res.status) possibleAddresses.push(LOCALHOST);
  } else {
    for (let i = SCANNER_START; i < SCANNER_END; i++) {
      const currentAddress = `${addressSpace}.${i}`;
      const res = await checkAddress(currentAddress);

      if (res.status) possibleAddresses.push(currentAddress);
    }
  }
  return possibleAddresses;
}

module.exports = runSetup;
