import { ServiceContainer } from './service-container';
import { SERVICE_TYPES } from './service-types';
import { AppDocumentContext, DocumentContext, PluginContext, AppPluginContext, AppQueuePluginContext } from '../contexts';
import { FetchPluginSessionService, AppFetchPluginSessionService } from '../session-services';
import {
    AppExperimentDataGroupDataService, AppExperimentDataService,
    ExperimentDataGroupDataService, ExperimentDataService,
    AppInstalledPackageDataService, InstalledPackageDataService,
    AppAllPackageDataService, AppSettingsDataService
} from '../data-services';
import { AppWebCoreService } from '../core-services';
import { AppFileCoreService } from '../core-services/file-core-service';
import { IpcService } from '../../../shared/services';
import { AppIpcService } from '../../app/services';

export class AppServiceContainer implements ServiceContainer {

    // Singletons

    // Contexts
    private documentContext: DocumentContext;
    private pluginContext: PluginContext;

    // Session Services
    private fetchPluginSessionService: FetchPluginSessionService;

    // Data Services
    private experimentDataGroupDataService: ExperimentDataGroupDataService;
    private experimentDataService: ExperimentDataService;
    private installedPackageDataService: InstalledPackageDataService;

    // Ipc Services
    private ipcService: IpcService;

    constructor() {

    }

    private getType(type: SERVICE_TYPES): any {
        switch (type) {
            // Context
            case SERVICE_TYPES.DocumentContext:
                if (this.documentContext) {
                    return this.documentContext;
                }
                this.documentContext = new AppDocumentContext();
                return this.documentContext;

            case SERVICE_TYPES.PluginContext:
                if (this.documentContext) {
                    return this.pluginContext;
                }
                const appPluginContext = new AppPluginContext();
                this.pluginContext = new AppQueuePluginContext(appPluginContext);
                return this.pluginContext;

            // Session Services
            case SERVICE_TYPES.FetchPluginSessionService:
                if (this.fetchPluginSessionService) {
                    return this.fetchPluginSessionService;
                }
                this.fetchPluginSessionService = new AppFetchPluginSessionService(this);
                return this.fetchPluginSessionService;

            // Ipc Services
            case SERVICE_TYPES.IpcService:
                if (this.ipcService) {
                    return this.ipcService;
                }
                this.ipcService = new AppIpcService();
                return this.ipcService;

            // Data Service
            case SERVICE_TYPES.ExperimentDataService:
                if (this.experimentDataService) {
                    return this.experimentDataService;
                }
                this.experimentDataService = new AppExperimentDataService();
                return this.experimentDataService;

            case SERVICE_TYPES.ExperimentDataGroupDataService:
                if (this.experimentDataGroupDataService) {
                    return this.experimentDataGroupDataService;
                }
                this.experimentDataGroupDataService = new AppExperimentDataGroupDataService();
                return this.experimentDataGroupDataService;

            case SERVICE_TYPES.InstalledPackageDataService:
                if (this.installedPackageDataService) {
                    return this.installedPackageDataService;
                }
                this.installedPackageDataService = new AppInstalledPackageDataService(this);
                return this.installedPackageDataService;

            case SERVICE_TYPES.AllPackageDataService:
                return new AppAllPackageDataService(this);

            case SERVICE_TYPES.SettingsDataService:
                return new AppSettingsDataService(this);

            // Core Services
            case SERVICE_TYPES.WebService:
                return new AppWebCoreService();

            case SERVICE_TYPES.FileService:
                return new AppFileCoreService();

            // Services


            // Producers

            // Consumers

            default:
                throw new Error(`Couldn't resolve type with value ${type}.`);
        }

    }

    resolve<T>(type: SERVICE_TYPES): T {
        return this.getType(type) as T;
    }

}
