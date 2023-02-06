const { dialog } = require("electron");

async function showConfirmationDialog(title, msg) {
  return await dialog.showMessageBox({
    title: title,
    message: msg,
    type: "question",
    buttons: ["Yes", "No"],
  });
}

module.exports = { showConfirmationDialog };
