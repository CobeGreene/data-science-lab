import { app, BrowserWindow } from 'electron';
import { IpcService } from '../../shared/services';
import { ServiceContainer, AppServiceContainer, SERVICE_TYPES } from './services-container';
import { Consumer } from './consumers';
import { ErrorEvents } from '../../shared/events';
export let win: BrowserWindow;


export class AppV2 {
    private ipcService: IpcService;
    private consumers: Consumer[];
    private servicesContainer: ServiceContainer;

    constructor(private preload: string, private indexPage: string) {
        this.servicesContainer = new AppServiceContainer();
    }

    public initialize() {
        this.ipcService = this.servicesContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        this.consumers = [
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.PackageConsumer)
        ];
        this.ipcService.on(ErrorEvents.ExceptionListeners, this.errorEvent);
    }

    public initializeConsumers() {
        this.consumers.forEach((consumer) => {
            consumer.initialize();
        });
        this.ipcService.removeListener(ErrorEvents.ExceptionListeners, this.errorEvent);
    }

    public destory() {
        this.consumers.forEach((consumer) => {
            consumer.destory();
        });
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