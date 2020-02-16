import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { PluginManager } from 'live-plugin-manager';

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
