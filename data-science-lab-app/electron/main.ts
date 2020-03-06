import { App } from './app/app';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
const settings = require('electron-settings');

console.log('start');

// Set electron settings path
settings.setPath(path.join(__dirname, '../app.settings.json'));

// Set electron color theme path
settings.set('color-theme', path.join(__dirname, '../app.color-theme.json'));

// Set electron user setting path
settings.set('user-setting', path.join(__dirname, '../app.user-setting.json'));

// Set electron plugin package path
settings.set('plugin-package', path.join(__dirname, '../plugin_packages'));

// Set dataset folder path
const datasetsPath = path.join(__dirname, '../datasets');
if (!fs.existsSync(datasetsPath)) {
    fs.mkdirSync(datasetsPath);
}
settings.set('datasets-path', datasetsPath);

const algorithmsPath = path.join(__dirname, '../algorithms');
if (!fs.existsSync(algorithmsPath)) {
    fs.mkdirSync(algorithmsPath);
}
settings.set('algorithms-path', algorithmsPath);

const trackersPath = path.join(__dirname, '../trackers');
if (!fs.existsSync(trackersPath)) {
    fs.mkdirSync(trackersPath);
}
settings.set('trackers-path', trackersPath);


const preload = path.join(__dirname, 'preload.js');
const angularApp = url.format({
    pathname: path.join(__dirname, '../data-science-lab-app/index.html'),
    protocol: 'file:',
    slashes: true
});

const app = new App(preload, angularApp);

app.initialize();

app.start();
