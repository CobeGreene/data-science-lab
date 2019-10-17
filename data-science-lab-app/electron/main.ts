import { App } from './app/app';
import * as path from 'path';
import * as url from 'url';
const settings = require('electron-settings');

settings.setPath(path.join(__dirname, '../custom.json'));
const preload = path.join(__dirname, 'preload.js');
const angularApp = url.format({
    pathname: path.join(__dirname, '../data-science-lab-app/index.html'),
    protocol: 'file:',
    slashes: true
});
const plugins = path.join(__dirname, '../plugins_packages');

const app = new App(plugins, preload, angularApp);

app.initialize();

app.start();

