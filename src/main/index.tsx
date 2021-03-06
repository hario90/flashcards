import { app, BrowserWindow, dialog, Event, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import * as path from "path";
import { format as formatUrl } from "url";

import { SAVE_DECK, SHOW_SAVE_DECK_MESSAGE } from "../shared/events";

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | undefined;

async function createMainWindow() {
    const window = new BrowserWindow({
        height: 750,
        webPreferences: {
            // Disables same-origin policy and allows us to query Labkey
            webSecurity: false,
        },
        width: 1000,
    });

    if (isDevelopment) {
        window.webContents.openDevTools();
    }

    if (isDevelopment) {
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
    } else {
        window.loadURL(formatUrl({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file",
            slashes: true,
        }));
    }

    window.on("closed", () => {
        mainWindow = undefined;
    });

    window.webContents.on("devtools-opened", () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        });
    });

    await autoUpdater.checkForUpdatesAndNotify();

    return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", async () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        console.log("activate");
        mainWindow = await createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on("ready", async () => {
    mainWindow = await createMainWindow();
});

ipcMain.on(SHOW_SAVE_DECK_MESSAGE, (event: Event) => {
    const opts = {
        buttons: ["Save", "Cancel"],
        message: "Save Deck?",
        title: "Question",
        type: "question",
    };

    if (mainWindow) {
        dialog.showMessageBox(mainWindow, opts, (response) => {
            event.sender.send(SAVE_DECK, response === 0);
        });
    }
});
