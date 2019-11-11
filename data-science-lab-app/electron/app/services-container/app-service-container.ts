import { ServiceContainer } from './service-container';
import { SERVICE_TYPES } from './service-types';
import { AppDocumentContext, DocumentContext, PluginContext, AppPluginContext, AppQueuePluginContext } from '../contexts';
import { AppFetchSessionService, FetchSessionService } from '../session-services';
import {
    AppExperimentDataGroupDataService, AppExperimentDataService,
    ExperimentDataGroupDataService, ExperimentDataService,
    AppPackageDataService, AppSettingsDataService, PackageDataService, SettingsDataService
} from '../data-services';
import { AppWebCoreService } from '../core-services';
import { AppFileCoreService } from '../core-services/file-core-service';
import { IpcService } from '../../../shared/services';
import { AppIpcService  } from '../ipc-services/app-ipc-service'; 
import { AppPackageService } from '../services';
import { AppPackageProducer, AppExperimentProducer } from '../producers';
import { AppPackageConsumer, AppExperimentConsumer } from '../consumers';
import { AppExperimentService } from '../services/experiment-service';
import { AppFetchService } from '../services/fetch-service/app-fetch.service';

export class AppServiceContainer implements ServiceContainer {

    // Singletons

    // Contexts
    private documentContext: DocumentContext;
    private pluginContext: PluginContext;

    // Session Services
    private fetchSessionService: FetchSessionService;

    // Data Services
    private experimentDataGroupDataService: ExperimentDataGroupDataService;
    private experimentDataService: ExperimentDataService;
    private packageDataService: PackageDataService;

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
                if (this.pluginContext) {
                    return this.pluginContext;
                }
                const settingsService = this.resolve<SettingsDataService>(SERVICE_TYPES.SettingsDataService);
                const appPluginContext = new AppPluginContext(settingsService.readPluginPath());
                this.pluginContext = new AppQueuePluginContext(appPluginContext);
                return this.pluginContext;

            // Session Services
            case SERVICE_TYPES.FetchSessionService:
                if (this.fetchSessionService) {
                    return this.fetchSessionService;
                }
                this.fetchSessionService = new AppFetchSessionService(this);
                return this.fetchSessionService;

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

            case SERVICE_TYPES.PackageDataService:
                if (this.packageDataService) {
                    return this.packageDataService;
                }
                this.packageDataService = new AppPackageDataService(this);
                return this.packageDataService;

            case SERVICE_TYPES.SettingsDataService:
                return new AppSettingsDataService(this);

            // Core Services
            case SERVICE_TYPES.WebService:
                return new AppWebCoreService();

            case SERVICE_TYPES.FileService:
                return new AppFileCoreService();

            // Services
            case SERVICE_TYPES.PackageService:
                return new AppPackageService(this);

            case SERVICE_TYPES.ExperimentService:
                return new AppExperimentService(this);

            // Producers
            case SERVICE_TYPES.PackageProducer:
                return new AppPackageProducer(this);

            case SERVICE_TYPES.ExperimentProducer:
                return new AppExperimentProducer(this);

            // Consumers
            case SERVICE_TYPES.PackageConsumer:
                return new AppPackageConsumer(this);
                
            case SERVICE_TYPES.ExperimentConsumer:
                return new AppExperimentConsumer(this);    

            default:
                throw new Error(`Couldn't resolve type with value ${type}.`);
        }

    }

    resolve<T>(type: SERVICE_TYPES): T {
        return this.getType(type) as T;
    }

}
