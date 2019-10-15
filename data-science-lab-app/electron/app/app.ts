import { app, BrowserWindow } from 'electron';

export class App {

    private win: BrowserWindow;
    private preload: string;
    private indexPage: string;

    constructor(preload: string, indexPage: string) {
        this.preload = preload;
        this.indexPage = indexPage;
    }

    public initialize() {

    }

    private createWindow() {
        this.win = new BrowserWindow({
            width: 1500, height: 1000,
            webPreferences: {
                preload: this.preload
            }
        });
        this.win.loadURL(this.indexPage);

        this.win.on('closed', () => {
            this.win = null;
        });
    }

    public start() {
        app.on('ready', () => {
            this.createWindow();
        });
        app.on('activate', () => {
            if (this.win == null) {
                this.createWindow();
            }
        });
    }
}
