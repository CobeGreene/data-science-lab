import { app, BrowserWindow } from 'electron';
import { ServiceContainer, AppServiceContainer, SERVICE_TYPES } from './service-container';
import { RoutingPipeline } from './pipeline';
import { AppIpcService } from './ipc-services';
import { IpcService } from '../../shared/services';
import { ExperimentServiceModel } from './services/experiment.sm';

export let win: BrowserWindow;

export class App {
    private serviceContainer: ServiceContainer;
    private pipeline: RoutingPipeline;

    constructor(private preload: string, private indexPage: string) {
        this.serviceContainer = new AppServiceContainer();
    }

    public initialize() {
        this.serviceContainer.addSingleton<IpcService>(AppIpcService, SERVICE_TYPES.IpcService);

        this.pipeline = new RoutingPipeline(this.serviceContainer, [
            ExperimentServiceModel.routes
        ]);
    }

    public destory() {
        
    }

    public configure() {
        this.pipeline.initialize();
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
        this.configure();
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
            console.warn(`uncaught exception ${error.name}, ${error.message}`);
        });
    }
}
