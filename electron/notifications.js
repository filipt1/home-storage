const { Notification } = require("electron");

function showNotification(title, msg) {
  if (!msg) return;

  new Notification({
    title: title,
    body: msg,
  }).show();
}

module.exports = {
  showNotification,
};
