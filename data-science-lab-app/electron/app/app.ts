import { app, BrowserWindow } from 'electron';
import { IpcService } from '../../shared/services';
import { ErrorEvents } from '../../shared/events';
import { ServiceContainer } from './services-container';
export let win: BrowserWindow;

export class App {

    private preload: string;
    private indexPage: string;
    private ipcService: IpcService;
    private servicesContainer: ServiceContainer;

    constructor(preload: string, indexPage: string) {
        this.preload = preload;
        this.indexPage = indexPage;
        this.servicesContainer = new ServiceContainer();
    }

    public initialize() {
        this.servicesContainer.configure();
        this.ipcService = this.servicesContainer.getIpcService();
    }
    
    public initializeConsumers() {
        this.servicesContainer.getConsumers().forEach((consumer) => {
            consumer.initialize();
        });

        this.ipcService.on(ErrorEvents.ExceptionListeners, this.errorEvent);
    }
    
    public destory() {
        this.servicesContainer.getConsumers().forEach((consumer) => {
            consumer.destory();
        });
        this.ipcService.removeListener(ErrorEvents.ExceptionListeners, this.errorEvent);
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
            this.destory();
            win = null;
        });
        this.initializeConsumers();
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

        process.on('uncaughtException', (error) => {
            console.log(`uncaught exception ${error.name}, ${error.message}`);
            this.ipcService.send(ErrorEvents.ExceptionListeners, `${error.message}`);
        });
    }

    private errorEvent = (event, arg) => {
        console.warn(`Error -\nEvent - ${event}\nArgs - ${arg}`);
    } 
}
