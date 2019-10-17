import { app, BrowserWindow } from 'electron';
import { PluginService } from './services/plugin-services/plugin.service';
import { MockPluginService } from './services/plugin-services/mock-plugin.service';
import { Plugin } from '../../shared/models/plugin';
import { Plugins } from '../../shared/models/plugins';
import { IpService } from '../../shared/services/ip.service';
import { AppIpService } from './services/app-services/app-ip.service';
import { AppPluginService } from './services/plugin-services/app-plugin.service';
import { PluginManager } from 'live-plugin-manager';
import * as ErrorEvents from '../../shared/events/error-events';

export let win: BrowserWindow;

export class App {

    private pluginsDir: string;
    private preload: string;
    private indexPage: string;
    private ipService: IpService;
    private pluginService: PluginService;
    private pluginManager: PluginManager;

    constructor(pluginsDir: string, preload: string, indexPage: string) {
        this.pluginsDir = pluginsDir;
        this.preload = preload;
        this.indexPage = indexPage;
    }

    public initialize() {
        this.ipService = new AppIpService();
        this.pluginManager = new PluginManager({
            pluginsPath: this.pluginsDir
        });
        // this.pluginService = MockPluginService.init(new Plugins([
        //     new Plugin('name', 'owner', 'repo')
        // ]), this.ipService);
        this.pluginService = new AppPluginService(this.ipService, this.pluginManager);

        this.ipService.on(ErrorEvents.ExceptionListeners, this.errorEvent);
    }
    
    public initializeService() {
        this.pluginService.inititalize();
    }
    
    public destory() {
        this.pluginService.destory();
        this.ipService.removeListener(ErrorEvents.ExceptionListeners, this.errorEvent);
    }

    private createWindow() {
        this.initializeService();
        win = new BrowserWindow({
            width: 1500, height: 1000,
            webPreferences: {
                preload: this.preload
            }
        });
        win.loadURL(this.indexPage);
        
        win.on('closed', () => {
            this.destory();
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

    private errorEvent = (event, arg) => {
        console.log(`Error -\nEvent - ${event}\nArgs - ${arg}`);
    } 
}
