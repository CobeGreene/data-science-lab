import { App } from './app/app';
import * as path from 'path';
import * as url from 'url';
console.log('start');

// Set electron settings path
const settings = require('electron-settings');
const settingsPath = path.join(__dirname, '../app.settings.json');
settings.setPath(settingsPath);

// Set electron color theme path
settings.set('color-theme', path.join(__dirname, '../app.color-theme.json'));

const preload = path.join(__dirname, 'preload.js');
const angularApp = url.format({
    pathname: path.join(__dirname, '../data-science-lab-app/index.html'),
    protocol: 'file:',
    slashes: true
});

const app = new App(preload, angularApp);

app.initialize();

app.start();
