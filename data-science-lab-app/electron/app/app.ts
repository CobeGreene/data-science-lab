import { app, BrowserWindow } from 'electron';
import { IpcService } from '../../shared/services';
import { ServiceContainer, AppServiceContainer, SERVICE_TYPES } from './services-container';
import { Consumer } from './consumers';
import { ErrorEvents } from '../../shared/events';
import { PluginContext } from './contexts';
export let win: BrowserWindow;


export class App {
    private ipcService: IpcService;
    private consumers: Consumer[];
    private servicesContainer: ServiceContainer;

    constructor(private preload: string, private indexPage: string) {
        this.servicesContainer = new AppServiceContainer();
    }

    public initialize() {
        this.ipcService = this.servicesContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        this.consumers = [
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.PackageConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.ExperimentConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.FetchPluginsConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.FetchSessionConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.DataGroupsConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.SelectTransformPluginsConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.TransformSessionConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.AlgorithmPluginsConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.AlgorithmSessionConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.AlgorithmConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.SelectVisualizationPluginsConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.DataVisualizationSessionConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.VisualizationsConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.AlgorithmVisualizationSessionConsumer),
            this.servicesContainer.resolve<Consumer>(SERVICE_TYPES.AlgorithmTestingSessionConsumer)
        ];
        this.ipcService.on(ErrorEvents.ExceptionListeners, this.errorEvent);
    }

    public initializeConsumers() {
        this.consumers.forEach((consumer) => {
            consumer.initialize();
        });
    }
    
    public destory() {
        this.consumers.forEach((consumer) => {
            consumer.destory();
        });
        this.ipcService.removeListener(ErrorEvents.ExceptionListeners, this.errorEvent);
        console.log(`Deactivating all`);
        const context = this.servicesContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
        context.deactivateAll();
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
            console.warn(`uncaught exception ${error.name}, ${error.message}`);
            this.ipcService.send(ErrorEvents.ExceptionListeners, `${error.message}`);
        });
    }

    private errorEvent = (event, arg) => {
        console.warn(`Error -\nEvent - ${event}\nArgs - ${arg}`);
    } 
}
