const net = require("net");
const Socket = net.Socket;

const PORT = 22;
const HOST = "127.0.0.1";

const IS_DEV = true;

function checkAddress(address, callback) {
  const socket = new Socket();

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
    callback(err, { status: status });
  });

  socket.connect(PORT, address);
}

function runSetup(callback) {
  const possibleAddresses = [];

  if (IS_DEV) {
    checkAddress(HOST, (err, res) => {
      if (res.status) possibleAddresses.push(HOST);

      callback(possibleAddresses);
    });
  } else {
    for (i = 1; i < 255; i++) {
      const currentAddress = `192.168.0.${i}`;

      checkAddress(currentAddress, (err, res) => {
        if (res.status) possibleAddresses.push(currentAddress);
      });
    }
    callback(possibleAddresses);
  }
}

module.exports = runSetup;
