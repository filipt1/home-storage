const { dialog } = require("electron");

async function showConfirmationDialog(title, msg) {
  return await dialog.showMessageBox({
    title: title,
    message: msg,
    type: "question",
    buttons: ["Yes", "No"],
  });
}

function showErrorDialog(title, msg) {
  dialog.showErrorBox(title, msg);
}

function showDisclaimer(msg) {
  dialog.showMessageBox({ title: "Disclaimer", message: msg, type: "info" });
}
module.exports = { showConfirmationDialog, showErrorDialog, showDisclaimer };
