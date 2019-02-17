import { app, BrowserWindow, dialog, Event, ipcMain } from "electron";
import * as url from "url";

import { events } from "../shared";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 1000, height: 800});

    // and load the index.html of the app.
    win.loadURL(url.format({
        host: "localhost:1212/dist",
        protocol: "http",
    }));

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on(events.SHOW_SAVE_DECK_MESSAGE, (event: Event) => {
    const opts = {
        buttons: ["Save", "Cancel"],
        message: "Save Deck?",
        title: "Question",
        type: "question",
    };

    if (win) {
        dialog.showMessageBox(win, opts, (response) => {
            console.log(response);
            event.sender.send(events.SAVE_DECK, response === 0);
        });
    }
});
