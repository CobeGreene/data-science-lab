import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow;

function createWindow() {
    win = new BrowserWindow({
        width: 1500, height: 1000,
        webPreferences: {
            preload: path.join(__dirname, `preload.js`),
        }
    });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `./data-science-lab-app/index.html`),
            protocol: 'file:',
            slashes: true,
        })
    );

    win.on('closed', () => {
        win = null;
    });
}


app.on('ready', createWindow);

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
