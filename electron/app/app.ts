import { app, BrowserWindow, screen, ipcMain } from 'electron';
import { ServiceContainer, AppServiceContainer, SERVICE_TYPES, Service } from './service-container';
import { RoutingPipeline, Producer } from './pipeline';
import { AppIpcService } from './ipc-services';
import { IpcService } from '../../shared/services';
import { ErrorEvent, ExperimentEvents } from '../../shared/events';
import { SettingsContext, AppSettingsContext } from './contexts/settings-context';
import { ThemeDataService, AppThemeDataService } from './data-services/theme-data-service';
import { ThemeServiceModel } from './services/theme.sm/theme.sm';
import { ExperimentDataService, AppExperimentDataService } from './data-services/experiment-data-service';
import { ExperimentServiceModel } from './services/experiment.sm/experiment.sm';
import { OpenLinkServiceModel } from './services/open-link.sm/open-link.sm';
import { UserSettingServiceModel } from './services/user-setting.sm';
import { AppUserSettingDataService, UserSettingDataService } from './data-services/user-setting-data-service';
import { WebService, FileService } from 'data-science-lab-core';
import { AppWebService } from './core-services/web-core-service/app-web.service';
import { PluginContext, AppPluginContext } from './contexts/plugin-context';
import { PackageDataService, AppPackageDataService } from './data-services/package-data-service';
import { PackageServiceModel } from './services/package.sm/package.sm';
import { FetchServiceModel } from './session-services/fetch.sm/fetch.sm';
import { PluginDataConverter } from './converters/plugin-data-converter/plugin-data.converter';
import { AppPluginDataConverter } from './converters/plugin-data-converter/app-plugin-data.converter';
import { AppFileCoreService } from './core-services/file-core-service/app-file.service';
import { DatasetDataService, AppDatasetDataService } from './data-services/dataset-data-service';
import { AlgorithmDataService, AppAlgorithmDataService } from './data-services/algorithm-data-service';
import { SessionDataService, AppSessionDataService } from './data-services/session-data-service';
import { AppQueuePluginContext } from './contexts/plugin-context/app-queue-plugin.context';
import { DatasetServiceModel } from './services/dataset.sm';
import { TransformServiceModel } from './session-services/transform.sm/transform.sm';
import { SessionPluginDataService, AppSessionPluginDataService } from './data-services/session-plugin-data-service';
import { SessionPluginServiceModel } from './services/session-plugin.sm';
import { CreateAlgorithmServiceModel } from './session-services/create-algorithm.sm';
import { AlgorithmServiceModel } from './services/algorithm.sm';
import { AlgorithmRecorderService, AppRecorderService } from './core-services/recorder-service';
import { TrackerDataService, AppTrackerDataService } from './data-services/tracker-data-service';
import { TrackerServiceModel } from './services/tracker.sm';
import { TestReportDataService, AppTestReportDataService } from './data-services/test-report-data-service';
import { VisualDataService, AppVisualDataService } from './data-services/visual-data-service';
import { TestReportSessionDataService, AppTestReportSessionDataService } from './data-services/test-report-session-data-service';
import { TestReportServiceModel } from './services/test-report.sm/test-report.sm';
import { CreateTestReportServiceModel } from './session-services/create-test-report.sm/create-test-report.sm';
import { VisualServiceModel } from './services/visual.sm';
import { DatasetVisualServiceModel } from './session-services/dataset-visual.sm';
import { AlgorithmVisualServiceModel } from './session-services/algorithm-visual.sm';
import { ExperimentState } from '../../shared/models';
import { ShortcutDataService, AppShortcutDataService } from './data-services/shortcut-data-service';
import { ShortcutServiceModel } from './services/shortcut.sm';
import { BrowserDataService, AppBrowserDataService } from './data-services/browser-data-service';
import { TestReportVisualServiceModel } from './session-services/test-report-visual.sm';
import { ApiPackageServiceModel } from './services/api-package.sm';

export let win: BrowserWindow;

export interface AppData {
    preload: string;
    index: string;
    options: {
        dev: boolean;
    }
};

export class App {
    private serviceContainer: ServiceContainer;
    private pipeline: RoutingPipeline;

    constructor(private data: AppData) {
        this.serviceContainer = new AppServiceContainer();
    }

    public initialize() {
        this.serviceContainer.addSingleton<IpcService>(AppIpcService, SERVICE_TYPES.IpcService);

        // Context
        this.serviceContainer.addSingleton<SettingsContext>(AppSettingsContext, SERVICE_TYPES.SettingsContext);
        this.serviceContainer.addSingleton<PluginContext>(AppPluginContext, SERVICE_TYPES.OriginalPluginContext);
        this.serviceContainer.addSingleton<PluginContext>(AppQueuePluginContext, SERVICE_TYPES.PluginContext);

        // Converters
        this.serviceContainer.addTransient<PluginDataConverter>(AppPluginDataConverter, SERVICE_TYPES.PluginDataConverter);

        // Data Services
        this.serviceContainer.addSingleton<ThemeDataService>(AppThemeDataService, SERVICE_TYPES.ThemeDataService);
        this.serviceContainer.addSingleton<ExperimentDataService>(AppExperimentDataService, SERVICE_TYPES.ExperimentDataService);
        this.serviceContainer.addSingleton<UserSettingDataService>(AppUserSettingDataService, SERVICE_TYPES.UserSettingDataService);
        this.serviceContainer.addSingleton<PackageDataService>(AppPackageDataService, SERVICE_TYPES.PackageDataService);
        this.serviceContainer.addSingleton<DatasetDataService>(AppDatasetDataService, SERVICE_TYPES.DatasetDataService);
        this.serviceContainer.addSingleton<SessionDataService>(AppSessionDataService, SERVICE_TYPES.SessionDataService);
        this.serviceContainer.addSingleton<SessionPluginDataService>(AppSessionPluginDataService, SERVICE_TYPES.SessionPluginDataService);
        this.serviceContainer.addSingleton<AlgorithmDataService>(AppAlgorithmDataService, SERVICE_TYPES.AlgorithmDataService);
        this.serviceContainer.addSingleton<TrackerDataService>(AppTrackerDataService, SERVICE_TYPES.TrackerDataService);
        this.serviceContainer.addSingleton<TestReportDataService>(AppTestReportDataService, SERVICE_TYPES.TestReportDataService);
        this.serviceContainer.addSingleton<VisualDataService>(AppVisualDataService, SERVICE_TYPES.VisualDataService);
        this.serviceContainer.addSingleton<TestReportSessionDataService>(
            AppTestReportSessionDataService, SERVICE_TYPES.TestReportSessionDataService);
        this.serviceContainer.addSingleton<ShortcutDataService>(AppShortcutDataService, SERVICE_TYPES.ShortcutDataService);
        this.serviceContainer.addSingleton<BrowserDataService>(AppBrowserDataService, SERVICE_TYPES.BrowserDataService);
            
        // Core Services
        this.serviceContainer.addTransient<WebService>(AppWebService, SERVICE_TYPES.WebService);
        this.serviceContainer.addTransient<FileService>(AppFileCoreService, SERVICE_TYPES.FileService);
        this.serviceContainer.addTransient<AlgorithmRecorderService>(AppRecorderService, SERVICE_TYPES.RecorderService);

        // Service Models
        this.serviceContainer.addTransient<Producer>(Producer, SERVICE_TYPES.Producer);
        this.serviceContainer.addTransient<ThemeServiceModel>(ThemeServiceModel, SERVICE_TYPES.ThemeServiceModel);
        this.serviceContainer.addTransient<ExperimentServiceModel>(ExperimentServiceModel, SERVICE_TYPES.ExperimentServiceModel);
        this.serviceContainer.addTransient<DatasetServiceModel>(DatasetServiceModel, SERVICE_TYPES.DatasetServiceModel);
        this.serviceContainer.addTransient<AlgorithmServiceModel>(AlgorithmServiceModel, SERVICE_TYPES.AlgorithmServiceModel);
        this.serviceContainer.addTransient<OpenLinkServiceModel>(OpenLinkServiceModel, SERVICE_TYPES.OpenLinkServiceModel);
        this.serviceContainer.addTransient<UserSettingServiceModel>(UserSettingServiceModel, SERVICE_TYPES.UserSettingServiceModel);
        this.serviceContainer.addTransient<PackageServiceModel>(PackageServiceModel, SERVICE_TYPES.PackageServiceModel);
        this.serviceContainer.addTransient<FetchServiceModel>(FetchServiceModel, SERVICE_TYPES.FetchServiceModel);
        this.serviceContainer.addTransient<TransformServiceModel>(TransformServiceModel, SERVICE_TYPES.TransformServiceModel);
        this.serviceContainer
            .addTransient<CreateAlgorithmServiceModel>(CreateAlgorithmServiceModel, SERVICE_TYPES.CreateAlgorithmServiceModel);
        this.serviceContainer.addTransient<SessionPluginServiceModel>(SessionPluginServiceModel, SERVICE_TYPES.SessionPluginServiceModel);
        this.serviceContainer.addTransient<TrackerServiceModel>(TrackerServiceModel, SERVICE_TYPES.TrackerServiceModel);
        this.serviceContainer.addTransient<TestReportServiceModel>(TestReportServiceModel, SERVICE_TYPES.TestReportServiceModel);
        this.serviceContainer
            .addTransient<CreateTestReportServiceModel>(CreateTestReportServiceModel, SERVICE_TYPES.CreateTestReportServiceModel);
        this.serviceContainer.addTransient<VisualServiceModel>(VisualServiceModel, SERVICE_TYPES.VisualServiceModel);
        this.serviceContainer.addTransient<DatasetVisualServiceModel>(DatasetVisualServiceModel, SERVICE_TYPES.DatasetVisualServiceModel);
        this.serviceContainer.addTransient<AlgorithmVisualServiceModel>(AlgorithmVisualServiceModel, SERVICE_TYPES.AlgorithmVisualServiceModel);
        this.serviceContainer.addTransient<DatasetVisualServiceModel>(DatasetVisualServiceModel, SERVICE_TYPES.DatasetVisualServiceModel);
        this.serviceContainer.addTransient<ShortcutServiceModel>(ShortcutServiceModel, SERVICE_TYPES.ShortcutServiceModel);
        this.serviceContainer.addTransient<TestReportVisualServiceModel>(TestReportVisualServiceModel, SERVICE_TYPES.TestReportVisualServiceModel);
        this.serviceContainer.addTransient<ApiPackageServiceModel>(ApiPackageServiceModel, SERVICE_TYPES.ApiPackageServiceModel);

        this.pipeline = new RoutingPipeline(this.serviceContainer, [
            ThemeServiceModel.routes,
            ExperimentServiceModel.routes,
            DatasetServiceModel.routes,
            AlgorithmServiceModel.routes,
            TrackerServiceModel.routes,
            OpenLinkServiceModel.routes,
            UserSettingServiceModel.routes,
            PackageServiceModel.routes,
            SessionPluginServiceModel.routes,
            FetchServiceModel.routes,
            TransformServiceModel.routes,
            TestReportServiceModel.routes,
            CreateAlgorithmServiceModel.routes,
            CreateTestReportServiceModel.routes,
            VisualServiceModel.routes,
            DatasetVisualServiceModel.routes,
            AlgorithmVisualServiceModel.routes,
            TestReportVisualServiceModel.routes,
            ShortcutServiceModel.routes,
            ApiPackageServiceModel.routes
        ]);
    }

    public async destory() {
        const experiments = this.serviceContainer.resolve<ExperimentDataService>(SERVICE_TYPES.ExperimentDataService);
        const datasets = this.serviceContainer.resolve<DatasetDataService>(SERVICE_TYPES.DatasetDataService);
        const visuals = this.serviceContainer.resolve<VisualDataService>(SERVICE_TYPES.VisualDataService);
        const algorithms = this.serviceContainer.resolve<AlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);
        const testReport = this.serviceContainer.resolve<TestReportDataService>(SERVICE_TYPES.TestReportDataService);
        const trackerReport = this.serviceContainer.resolve<TrackerDataService>(SERVICE_TYPES.TrackerDataService);

        for (let experiment of experiments.all().filter(value => value.state === ExperimentState.Loaded)) {
            datasets.save(experiment.id);            
            visuals.save(experiment.id);
            for (let algorithm of algorithms.all(experiment.id)) {
                testReport.save(algorithm.id);
                trackerReport.save(algorithm.id);
            }
            await algorithms.save(experiment.id);
        }

    }

    public configure() {
        this.pipeline.initialize();
        this.serviceContainer.resolve<ThemeDataService>(SERVICE_TYPES.ThemeDataService).configure();
        this.serviceContainer.resolve<ExperimentDataService>(SERVICE_TYPES.ExperimentDataService).configure();
        this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext).configure();
        this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService).configure();
        this.serviceContainer.resolve<DatasetDataService>(SERVICE_TYPES.DatasetDataService).configure();
        this.serviceContainer.resolve<AlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService).configure();
        this.serviceContainer.resolve<TestReportDataService>(SERVICE_TYPES.TestReportDataService).configure();
        this.serviceContainer.resolve<VisualDataService>(SERVICE_TYPES.VisualDataService).configure();
    }

    private createWindow() {
        const electronScreen = screen;
        const size = electronScreen.getPrimaryDisplay().workAreaSize;

        win = new BrowserWindow({
            x: 0,
            y: 0,
            width: size.width, height: size.height,
            webPreferences: {
                preload: this.data.preload,
                
            },
            title: 'Data Science Lab'
        });

        if (!this.data.options.dev) {
            win.setMenu(null); // to allow some of the shortcuts.
        }

        this.configure();
        win.loadURL(this.data.index);

        win.on('close', async (event: Event) => {
            event.preventDefault();
            await this.destory();
            win.destroy();

        });

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
