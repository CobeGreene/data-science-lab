import { ServiceContainer } from './service-container';
import { SERVICE_TYPES } from './service-types';
import { AppDocumentContext, DocumentContext, PluginContext, AppPluginContext, AppQueuePluginContext } from '../contexts';
import {
    AppFetchSessionService, FetchSessionService, TransformSessionService,
    AppTransformSessionService, AlgorithmSessionService, AppAlgorithmSessionService
} from '../session-services';
import {
    AppExperimentDataGroupDataService, AppExperimentDataService,
    ExperimentDataGroupDataService, ExperimentDataService,
    AppPackageDataService, AppSettingsDataService, PackageDataService,
    SettingsDataService, SelectTransformPluginsDataService,
    AppSelectTransformPluginsDataService, AlgorithmPluginsDataService,
    AppAlgorithmPluginsDataService,
    ExperimentAlgorithmDataService,
    AppAlgorithmDataService
} from '../data-services';
import { AppWebCoreService, AppFileCoreService } from '../core-services';
import { IpcService } from '../../../shared/services';
import { AppIpcService } from '../ipc-services/app-ipc-service';
import {
    AppFetchService, AppPackageService, AppSelectTransformPluginsService,
    AppExperimentService, AppFetchPluginsService, AppDataGroupsService,
    AppAlgorithmPluginsService, AppTransformService, AppAlgorithmSessionOptionsService
} from '../services';
import {
    AppPackageProducer, AppExperimentProducer, AppFetchPluginsProducer,
    AppFetchSessionProducer, AppDataGroupsProducer, AppSelectTransformPluginsProducer,
    AppTransformSessionProducer, AppAlgorithmPluginsProducer, AppAlgorithmSessionProducer
} from '../producers';
import {
    AppPackageConsumer, AppExperimentConsumer, AppFetchPluginsConsumer,
    AppFetchSessionConsumer, AppDataGroupsConsumer, AppSelectTransformPluginsConsumer,
    AppTransformSessionConsumer, AppAlgorithmPluginsConsumer, AppAlgorithmSessionConsumer, AppAlgorithmConsumer
} from '../consumers';
import { AppPluginDataConverter, AppDataGroupConverter } from '../converters';

export class AppServiceContainer implements ServiceContainer {

    // Singletons

    // Contexts
    private documentContext: DocumentContext;
    private pluginContext: PluginContext;

    // Session Services
    private fetchSessionService: FetchSessionService;
    private transformSessionService: TransformSessionService;
    private algorithmSessionService: AlgorithmSessionService;

    // Data Services
    private experimentDataGroupDataService: ExperimentDataGroupDataService;
    private experimentDataService: ExperimentDataService;
    private packageDataService: PackageDataService;
    private selectTransformPluginsDataService: SelectTransformPluginsDataService;
    private algorithmPluginsDataService: AlgorithmPluginsDataService;
    private algorithmDataService: ExperimentAlgorithmDataService;

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

            // Converter
            case SERVICE_TYPES.PluginDataConverter:
                return new AppPluginDataConverter();

            case SERVICE_TYPES.DataGroupConverter:
                return new AppDataGroupConverter();

            // Session Services
            case SERVICE_TYPES.FetchSessionService:
                if (this.fetchSessionService) {
                    return this.fetchSessionService;
                }
                this.fetchSessionService = new AppFetchSessionService(this);
                return this.fetchSessionService;

            case SERVICE_TYPES.TransformSessionService:
                if (this.transformSessionService) {
                    return this.transformSessionService;
                }
                this.transformSessionService = new AppTransformSessionService(this);
                return this.transformSessionService;

            case SERVICE_TYPES.AlgorithmSessionService:
                if (this.algorithmSessionService) {
                    return this.algorithmSessionService;
                }
                this.algorithmSessionService = new AppAlgorithmSessionService(this);
                return this.algorithmSessionService;

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

            case SERVICE_TYPES.SelectTransformPluginsDataService:
                if (this.selectTransformPluginsDataService) {
                    return this.selectTransformPluginsDataService;
                }
                this.selectTransformPluginsDataService = new AppSelectTransformPluginsDataService(this);
                return this.selectTransformPluginsDataService;

            case SERVICE_TYPES.AlgorithmDataService:
                if (this.algorithmDataService) {
                    return this.algorithmDataService;
                }
                this.algorithmDataService = new AppAlgorithmDataService(this);
                return this.algorithmDataService;

            case SERVICE_TYPES.SettingsDataService:
                return new AppSettingsDataService(this);

            case SERVICE_TYPES.AlgorithmPluginsDataService:
                if (this.algorithmPluginsDataService) {
                    return this.algorithmPluginsDataService;
                }
                this.algorithmPluginsDataService = new AppAlgorithmPluginsDataService(this);
                return this.algorithmPluginsDataService;

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

            case SERVICE_TYPES.FetchPluginsService:
                return new AppFetchPluginsService(this);

            case SERVICE_TYPES.FetchService:
                return new AppFetchService(this);

            case SERVICE_TYPES.DataGroupsService:
                return new AppDataGroupsService(this);

            case SERVICE_TYPES.SelectTransformPluginsService:
                return new AppSelectTransformPluginsService(this);

            case SERVICE_TYPES.TransformService:
                return new AppTransformService(this);

            case SERVICE_TYPES.AlgorithmPluginsService:
                return new AppAlgorithmPluginsService(this);

            case SERVICE_TYPES.AlgorithmSessionOptionsService:
                return new AppAlgorithmSessionOptionsService(this);

            // Producers
            case SERVICE_TYPES.PackageProducer:
                return new AppPackageProducer(this);

            case SERVICE_TYPES.ExperimentProducer:
                return new AppExperimentProducer(this);

            case SERVICE_TYPES.FetchSessionProducer:
                return new AppFetchSessionProducer(this);

            case SERVICE_TYPES.FetchPluginsProducer:
                return new AppFetchPluginsProducer(this);

            case SERVICE_TYPES.DataGroupsProducer:
                return new AppDataGroupsProducer(this);

            case SERVICE_TYPES.SelectTransformPluginsProducer:
                return new AppSelectTransformPluginsProducer(this);

            case SERVICE_TYPES.TransformSessionProducer:
                return new AppTransformSessionProducer(this);

            case SERVICE_TYPES.AlgorithmPluginsProducer:
                return new AppAlgorithmPluginsProducer(this);

            case SERVICE_TYPES.AlgorithmSessionProducer:
                return new AppAlgorithmSessionProducer(this);
                

            // Consumers
            case SERVICE_TYPES.PackageConsumer:
                return new AppPackageConsumer(this);

            case SERVICE_TYPES.ExperimentConsumer:
                return new AppExperimentConsumer(this);

            case SERVICE_TYPES.FetchSessionConsumer:
                return new AppFetchSessionConsumer(this);

            case SERVICE_TYPES.FetchPluginsConsumer:
                return new AppFetchPluginsConsumer(this);

            case SERVICE_TYPES.DataGroupsConsumer:
                return new AppDataGroupsConsumer(this);

            case SERVICE_TYPES.SelectTransformPluginsConsumer:
                return new AppSelectTransformPluginsConsumer(this);

            case SERVICE_TYPES.TransformSessionConsumer:
                return new AppTransformSessionConsumer(this);

            case SERVICE_TYPES.AlgorithmPluginsConsumer:
                return new AppAlgorithmPluginsConsumer(this);

            case SERVICE_TYPES.AlgorithmSessionConsumer:
                return new AppAlgorithmSessionConsumer(this);

            case SERVICE_TYPES.AlgorithmConsumer:
                return new AppAlgorithmConsumer(this);
            

            default:
                throw new Error(`Couldn't resolve type with value ${type}.`);
        }

    }

    resolve<T>(type: SERVICE_TYPES): T {
        return this.getType(type) as T;
    }

}
