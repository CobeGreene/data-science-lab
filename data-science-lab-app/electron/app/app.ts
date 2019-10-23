import { app, BrowserWindow } from 'electron';
import { IpService } from '../../shared/services';
import { AppIpService, AppPackageService, PackageService, AppSettingService, SettingService } from './services';
import { PluginManager } from 'live-plugin-manager';
import { ErrorEvents } from '../../shared/events';
import { AppWebService } from './services/web-services';
import { WebService } from 'data-science-lab-core';

export let win: BrowserWindow;

export class App {

    private pluginsDir: string;
    private preload: string;
    private indexPage: string;
    private settingsPath: string; 
    private ipService: IpService;
    private packageManager: PackageService;
    private pluginManager: PluginManager;
    private settingsService: SettingService;
    private webService: WebService;

    constructor(pluginsDir: string, preload: string, indexPage: string, settingsPath: string) {
        this.pluginsDir = pluginsDir;
        this.preload = preload;
        this.indexPage = indexPage;
        this.settingsPath = settingsPath;
    }

    public initialize() {
        this.settingsService = new AppSettingService(this.settingsPath);
        this.webService = new AppWebService();
        this.ipService = new AppIpService();
        this.pluginManager = new PluginManager({
            pluginsPath: this.pluginsDir
        });
        this.packageManager = new AppPackageService(this.ipService, this.pluginManager, this.settingsService, this.webService);

        this.ipService.on(ErrorEvents.ExceptionListeners, this.errorEvent);
    }
    
    public initializeService() {
        this.packageManager.inititalize();
    }
    
    public destory() {
        this.packageManager.destory();
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
        console.warn(`Error -\nEvent - ${event}\nArgs - ${arg}`);
    } 
}
