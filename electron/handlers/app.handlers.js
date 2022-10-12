const config = require("../config");
const handlers = require("./sftp.handlers");

async function initializeConnection() {
  await handlers.connect(client, config);

  return {
    homeLocal: config.homeLocal,
    homeRemote: config.homeRemote,
  };
}
