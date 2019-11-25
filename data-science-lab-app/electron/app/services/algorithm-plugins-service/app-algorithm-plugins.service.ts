import { PluginPackage } from '../../../../shared/models';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';
import { AlgorithmPluginsService } from './algorithm-plugins.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { AlgorithmPluginsProducer } from '../../producers/algorithm-plugins-producer';
import { AlgorithmPluginsDataService } from '../../data-services';

export class AppAlgorithmPluginsService implements AlgorithmPluginsService {

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): void {
        const dataService = this.serviceContainer
            .resolve<AlgorithmPluginsDataService>(SERVICE_TYPES.AlgorithmPluginsDataService);
        this.sendAll(dataService.all(this.sendAll, this.sendError));
    }

    private sendAll = (plugins: AlgorithmPluginViewModel[]): void => {
        const producer = this.serviceContainer.resolve<AlgorithmPluginsProducer>(SERVICE_TYPES.AlgorithmPluginsProducer);
        producer.all(plugins);
    }

    private sendError = (reason: any): void => {
        const producer = this.serviceContainer.resolve<AlgorithmPluginsProducer>(SERVICE_TYPES.AlgorithmPluginsProducer);
        producer.error(reason);
    }

    install(pluginPackage: PluginPackage): void {
        const dataService = this.serviceContainer
            .resolve<AlgorithmPluginsDataService>(SERVICE_TYPES.AlgorithmPluginsDataService);
        
        dataService.install(pluginPackage)
            .then(this.sendAll)
            .catch(this.sendError);
    }

    uninstall(pluginPackage: PluginPackage): void {
        const dataService = this.serviceContainer
            .resolve<AlgorithmPluginsDataService>(SERVICE_TYPES.AlgorithmPluginsDataService);
        
        dataService.uninstall(pluginPackage)
            .then(this.sendAll)
            .catch(this.sendError);
    }
}

