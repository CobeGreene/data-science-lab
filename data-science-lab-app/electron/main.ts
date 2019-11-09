import { AppV2 } from './appV2/app';
import * as path from 'path';
import * as url from 'url';
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

const app = new AppV2(preload, angularApp);

app.initialize();

app.start();
