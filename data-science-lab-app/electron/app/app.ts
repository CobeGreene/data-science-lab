import { app, BrowserWindow } from 'electron';
import { PluginService } from './services/plugin-services/plugin.service';
import { MockPluginService } from './services/plugin-services/mock-plugin.service';
import { Plugin } from '../../shared/models/plugin';
import { Plugins } from '../../shared/models/plugins';

export let win: BrowserWindow;

export class App {

    private preload: string;
    private indexPage: string;

    private pluginService: PluginService;

    constructor(preload: string, indexPage: string) {
        this.preload = preload;
        this.indexPage = indexPage;
    }

    public initialize() {
        this.pluginService = MockPluginService.init(new Plugins([
            new Plugin('name', 'owner', 'repo')
        ]));
        
        this.pluginService.inititalize();
    }

    private createWindow() {
        win = new BrowserWindow({
            width: 1500, height: 1000,
            webPreferences: {
                preload: this.preload
            }
        });
        win.loadURL(this.indexPage);

        win.on('closed', () => {
            win = null;
        });
    }

    public start() {
        app.on('ready', () => {
            this.createWindow();
        });
        app.on('activate', () => {
            if (win == null) {
                this.createWindow();
            }
        });
    }
}
