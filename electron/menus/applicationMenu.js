const { Menu, app } = require("electron");
const { deleteConfig, readConfig } = require("../handlers/config.handler");

async function createApplicationMenu() {
  const menu = Menu.buildFromTemplate([
    {
      role: "appMenu",
      label: "Personal Cloud",
      submenu: [
        {
          role: "minimize",
        },
        {
          role: "close",
        },
        {
          label: "Logout",
          enabled: (await readConfig()) ? true : false,
          async click(menuItem, browserWindow) {
            deleteConfig();
            app.emit("app:delete-config");
            // fix pro build
            await browserWindow.loadURL("http://localhost:3000");
          },
        },
        {
          role: "quit",
        },
      ],
    },

    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { type: "separator" },
        { role: "selectAll" },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}

module.exports = createApplicationMenu;
