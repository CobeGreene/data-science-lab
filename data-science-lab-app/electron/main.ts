import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { PluginManager } from 'live-plugin-manager';
const settings = require('electron-settings');
const settingsPath = path.join(__dirname, '../app.settings.json');
settings.setPath(settingsPath);

let win: BrowserWindow;
let plugin = new PluginManager();

function createWindow() {
    win = new BrowserWindow({
        width: 800, height: 600,
        webPreferences: {
            preload: path.join(__dirname, `preload.js`),
        }
    });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `../data-science-lab-app/index.html`),
            protocol: 'file:',
            slashes: true,
        })
    );

    win.on('closed', () => {
        win = null;
        plugin = null;
    });
}


app.on('ready', createWindow);

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

ipcMain.on('event', () => {
    const title = settings.get('title');
    console.log('electron side');
    win.webContents.send('listener', title);
});
