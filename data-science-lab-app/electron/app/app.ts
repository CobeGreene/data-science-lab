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
import { UserSettingServiceModel } from './services/user-setting.sm';
import { AppUserSettingDataService, UserSettingDataService } from './data-services/user-setting-data-service';
import { WebService } from 'data-science-lab-core';
import { AppWebService } from './core-services/web-core-service/app-web.service';
import { PluginContext, AppPluginContext } from './contexts/plugin-context';
import { PackageDataService, AppPackageDataService } from './data-services/package-data-service';
import { PackageServiceModel } from './services/package.sm/package.sm';

export let win: BrowserWindow;

export class App {
    private serviceContainer: ServiceContainer;
    private pipeline: RoutingPipeline;

    constructor(private preload: string, private indexPage: string) {
        this.serviceContainer = new AppServiceContainer();
    }

    public initialize() {
        this.serviceContainer.addSingleton<IpcService>(AppIpcService, SERVICE_TYPES.IpcService);
        
        // Context
        this.serviceContainer.addSingleton<SettingsContext>(AppSettingsContext, SERVICE_TYPES.SettingsContext);
        this.serviceContainer.addSingleton<PluginContext>(AppPluginContext, SERVICE_TYPES.PluginContext);

        // Data Services
        this.serviceContainer.addSingleton<ThemeDataService>(AppThemeDataService, SERVICE_TYPES.ThemeDataService);
        this.serviceContainer.addSingleton<ExperimentDataService>(AppExperimentDataService, SERVICE_TYPES.ExperimentDataService);
        this.serviceContainer.addSingleton<UserSettingDataService>(AppUserSettingDataService, SERVICE_TYPES.UserSettingDataService);
        this.serviceContainer.addSingleton<PackageDataService>(AppPackageDataService, SERVICE_TYPES.PackageDataService);

        // Core Services
        this.serviceContainer.addTransient<WebService>(AppWebService, SERVICE_TYPES.WebService);

        // Service Models 
        this.serviceContainer.addTransient<Producer>(Producer, SERVICE_TYPES.Producer);
        this.serviceContainer.addTransient<ThemeServiceModel>(ThemeServiceModel, SERVICE_TYPES.ThemeServiceModel);
        this.serviceContainer.addTransient<ExperimentServiceModel>(ExperimentServiceModel, SERVICE_TYPES.ExperimentServiceModel);
        this.serviceContainer.addTransient<OpenLinkServiceModel>(OpenLinkServiceModel, SERVICE_TYPES.OpenLinkServiceModel);
        this.serviceContainer.addTransient<UserSettingServiceModel>(UserSettingServiceModel, SERVICE_TYPES.UserSettingServiceModel);
        this.serviceContainer.addTransient<PackageServiceModel>(PackageServiceModel, SERVICE_TYPES.PackageServiceModel);

        this.pipeline = new RoutingPipeline(this.serviceContainer, [
            ThemeServiceModel.routes,
            ExperimentServiceModel.routes,
            OpenLinkServiceModel.routes,
            UserSettingServiceModel.routes,
            PackageServiceModel.routes,
        ]);
    }

    public destory() {

    }

    public configure() {
        this.pipeline.initialize();
        this.serviceContainer.resolve<ThemeDataService>(SERVICE_TYPES.ThemeDataService).configure();
        this.serviceContainer.resolve<ExperimentDataService>(SERVICE_TYPES.ExperimentDataService).configure();
        this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext).configure();
        this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService).configure();
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

        // win.setMenu(null); // to allow some of the shortcuts. 


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
