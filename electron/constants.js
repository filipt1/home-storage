const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 600;

const SHOW_DEV_TOOLS = false;

const ARCHIVE_DIR = "cloud-archive";

const SSH_PORT = 22;
const LOCALHOST = "127.0.0.1";
const SCANNER_START = 1;
const SCANNER_END = 254;

const DOWNLOAD_TITLE = "Download complete";

const CONFIG_DIR = "config";
const CONFIG_FILE = "config.json";

const LOCKED_OPERATIONS_MSG =
  "You have to unlock the file to enable operations. Navigate to Locked Files and unlock it";

module.exports = {
  ARCHIVE_DIR,
  CONFIG_DIR,
  CONFIG_FILE,
  LOCKED_OPERATIONS_MSG,
  DOWNLOAD_TITLE,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  SSH_PORT,
  LOCALHOST,
  SCANNER_START,
  SCANNER_END,
  SHOW_DEV_TOOLS,
};
