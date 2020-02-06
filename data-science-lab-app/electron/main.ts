import { App } from './app/app';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
const settings = require('electron-settings');
console.log('start');
const settingsPath = path.join(__dirname, '../app.settings.json');
settings.setPath(settingsPath);

const preload = path.join(__dirname, 'preload.js');
const angularApp = url.format({
    pathname: path.join(__dirname, '../data-science-lab-app/index.html'),
    protocol: 'file:',
    slashes: true
});
const plugins = path.join(__dirname, '../plugins_packages');
settings.set('plugins-package', plugins);
const experimentFolder = path.join(__dirname, '../experiments');
settings.set('experiment-folder', experimentFolder);
if (!fs.existsSync(experimentFolder)) {
    fs.mkdirSync(experimentFolder);
}

const app = new App(preload, angularApp);

app.initialize();

app.start();
