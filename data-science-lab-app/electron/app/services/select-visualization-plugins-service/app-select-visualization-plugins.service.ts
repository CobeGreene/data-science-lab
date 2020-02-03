import { PluginPackage } from '../../../../shared/models';
import { VisualizationPluginViewModel } from '../../../../shared/view-models';
import { SelectVisualizationPluginsService } from './select-visualization-plugins.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { SelectVisualizationPluginsDataService } from '../../data-services';
import { SelectVisualizationPluginsProducer } from '../../producers';

export class AppSelectVisualizationPluginsService implements SelectVisualizationPluginsService {

    constructor(private serviceContainer: ServiceContainer) {

    }
    
    all(): void {
        const dataService = this.serviceContainer
        .resolve<SelectVisualizationPluginsDataService>(SERVICE_TYPES.SelectVisualizationPluginsDataService);
        this.sendAll(dataService.all(this.sendAll, this.sendError));
    }   
    
    private sendAll = (plugins: VisualizationPluginViewModel[]): void => {
        const producer = this.serviceContainer
            .resolve<SelectVisualizationPluginsProducer>(SERVICE_TYPES.SelectVisualizationPluginsProducer);
        producer.all(plugins);
    }

    private sendError = (reason: any): void => {
        const producer = this.serviceContainer
            .resolve<SelectVisualizationPluginsProducer>(SERVICE_TYPES.SelectVisualizationPluginsProducer);
        producer.error(reason);
    }
    
    install(pluginPackage: PluginPackage): void {
        const dataService = this.serviceContainer
        .resolve<SelectVisualizationPluginsDataService>(SERVICE_TYPES.SelectVisualizationPluginsDataService);

        dataService.install(pluginPackage)
            .then(this.sendAll)
            .catch(this.sendError);
    }
    
    uninstall(pluginPackage: PluginPackage): void {
        const dataService = this.serviceContainer
        .resolve<SelectVisualizationPluginsDataService>(SERVICE_TYPES.SelectVisualizationPluginsDataService);
        dataService.uninstall(pluginPackage)
            .then(this.sendAll)
            .catch(this.sendError);
    }

}

