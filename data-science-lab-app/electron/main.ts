import { App } from './app/app';
import * as path from 'path';
import * as url from 'url';

const preload = path.join(__dirname, 'preload.js');
const angularApp = url.format({
    pathname: path.join(__dirname, '../data-science-lab-app/index.html'),
    protocol: 'file:',
    slashes: true
});

const app = new App(preload, angularApp);

app.initialize();

app.start();

