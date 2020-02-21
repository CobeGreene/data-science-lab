import { app, BrowserWindow, screen } from 'electron';
import { ServiceContainer, AppServiceContainer, SERVICE_TYPES, Service } from './service-container';
import { RoutingPipeline, Producer } from './pipeline';
import { AppIpcService } from './ipc-services';
import { IpcService } from '../../shared/services';
import { ErrorEvent } from '../../shared/events';
import { SettingsContext, AppSettingsContext } from './contexts/settings-context';
import { ThemeDataService, AppThemeDataService } from './data-services/theme-data-service';
import { ThemeServiceModel } from './services/theme.sm/theme.sm';
import { ExperimentDataService, AppExperimentDataService } from './data-services/experiment-data-service';
import { ExperimentServiceModel } from './services/experiment.sm/experiment.sm';
import { OpenLinkServiceModel } from './services/open-link.sm/open-link.sm';

export let win: BrowserWindow;

export class App {
    private serviceContainer: ServiceContainer;
    private pipeline: RoutingPipeline;

    constructor(private preload: string, private indexPage: string) {
        this.serviceContainer = new AppServiceContainer();
    }

    public initialize() {
        this.serviceContainer.addSingleton<IpcService>(AppIpcService, SERVICE_TYPES.IpcService);
        this.serviceContainer.addSingleton<SettingsContext>(AppSettingsContext, SERVICE_TYPES.SettingsContext);
        this.serviceContainer.addSingleton<ThemeDataService>(AppThemeDataService, SERVICE_TYPES.ThemeDataService);
        this.serviceContainer.addSingleton<ExperimentDataService>(AppExperimentDataService, SERVICE_TYPES.ExperimentDataService);

        this.serviceContainer.addTransient<Producer>(Producer, SERVICE_TYPES.Producer);
        this.serviceContainer.addTransient<ThemeServiceModel>(ThemeServiceModel, SERVICE_TYPES.ThemeServiceModel);
        this.serviceContainer.addTransient<ExperimentServiceModel>(ExperimentServiceModel, SERVICE_TYPES.ExperimentServiceModel);
        this.serviceContainer.addTransient<OpenLinkServiceModel>(OpenLinkServiceModel, SERVICE_TYPES.OpenLinkServiceModel);

        this.pipeline = new RoutingPipeline(this.serviceContainer, [
            ThemeServiceModel.routes,
            ExperimentServiceModel.routes,
            OpenLinkServiceModel.routes
        ]);
    }

    public destory() {

    }

    public configure() {
        this.pipeline.initialize();
        this.serviceContainer.resolve<ThemeDataService>(SERVICE_TYPES.ThemeDataService).configure();
        this.serviceContainer.resolve<ExperimentDataService>(SERVICE_TYPES.ExperimentDataService).configure();
    }

    private createWindow() {
        const electronScreen = screen;
        const size = electronScreen.getPrimaryDisplay().workAreaSize;

        win = new BrowserWindow({
            x: 0,
            y: 0,
            width: size.width, height: size.height,
            webPreferences: {
                preload: this.preload
            }
        });


        this.configure();
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

        process.on('uncaughtException', (error) => {
            if (error instanceof Error) {
                console.log('uncaught error', error.message, error.name);
            } else {
                const producer = this.serviceContainer.resolve<Producer>(SERVICE_TYPES.Producer);
                producer.send(ErrorEvent, error);
            }
        });
    }
}
