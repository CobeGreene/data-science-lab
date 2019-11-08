import { ServiceContainer } from './service-container';
import { SERVICE_TYPES } from './service-types';
import { AppDocumentContext, DocumentContext, PluginContext, AppPluginContext, AppQueuePluginContext } from '../contexts';
import { FetchPluginSessionService, AppFetchPluginSessionService } from '../session-services';
import { AppExperimentDataGroupDataService, AppExperimentDataService,
         ExperimentDataGroupDataService, ExperimentDataService } from '../data-services';

class AppServiceContainer implements ServiceContainer {

    // Singletons

    // Contexts
    private documentContext: DocumentContext;
    private pluginContext: PluginContext;
    
    // Session Services
    private fetchPluginSessionService: FetchPluginSessionService;
    
    // Data Services
    private experimentDataGroupDataService: ExperimentDataGroupDataService;
    private experimentDataService: ExperimentDataService; 

    // Services


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
                this.fetchPluginSessionService = new AppFetchPluginSessionService(
                    this.resolve<PluginContext>(SERVICE_TYPES.PluginContext));    
                return this.fetchPluginSessionService;

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

            default:
                throw new Error(`Couldn't resolve type with value ${type}.`);
        }

    }

    resolve<T>(type: SERVICE_TYPES): T {
        return this.getType(type) as T;
    }

}

export const serviceContainer = new AppServiceContainer();
