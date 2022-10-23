const net = require("net");
const Socket = net.Socket;

const PORT = 22;
const HOST = "127.0.0.1";

const IS_DEV = false;

async function checkAddress(address) {
  const socket = new Socket();

  return new Promise(function (resolve, reject) {
    let error = null;
    let status = null;
    let connectionRefused = false;

    socket.setTimeout(500);
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

    socket.connect(PORT, address);
  });
}

async function runSetup() {
  const possibleAddresses = [];

  if (IS_DEV) {
    const res = await checkAddress(HOST);
    if (res.status) possibleAddresses.push(HOST);
  } else {
    for (i = 2; i < 155; i++) {
      const currentAddress = `192.168.0.${i}`;
      const res = await checkAddress(currentAddress);

      if (res.status) possibleAddresses.push(currentAddress);
    }
  }
  return possibleAddresses;
}

module.exports = runSetup;
