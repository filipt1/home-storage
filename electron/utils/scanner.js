const net = require("net");

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

async function runSetup() {
  const possibleAddresses = [];

  if (SCAN_LOCALHOST) {
    const res = await checkAddress(LOCALHOST);
    if (res.status) possibleAddresses.push(LOCALHOST);
  } else {
    for (let i = SCANNER_START; i < SCANNER_END; i++) {
      // zmenit na i = 2
      const currentAddress = `192.168.0.${i}`;
      const res = await checkAddress(currentAddress);

      if (res.status) possibleAddresses.push(currentAddress);
    }
  }
  return possibleAddresses;
}

module.exports = runSetup;
