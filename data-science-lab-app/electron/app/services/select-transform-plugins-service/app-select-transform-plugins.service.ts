import { PluginPackage, SelectTransformPlugin } from '../../../../shared/models';
import { SelectTransformPluginsService } from './select-transform-plugins.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { SelectTransformPluginsDataService } from '../../data-services';
import {  SelectTransformPluginsProducer } from '../../producers/select-transform-plugins-producer';

export class AppSelectTransformPluginsService implements SelectTransformPluginsService {

    constructor(private serviceContainer: ServiceContainer) {

    }
    
    all(): void {
        const dataService = this.serviceContainer
        .resolve<SelectTransformPluginsDataService>(SERVICE_TYPES.SelectTransformPluginsDataService);
        this.sendAll(dataService.all(this.sendAll, this.sendError));
    }   
    
    private sendAll = (plugins: SelectTransformPlugin[]): void => {
        const producer = this.serviceContainer.resolve<SelectTransformPluginsProducer>(SERVICE_TYPES.SelectTransformPluginsProducer);
        producer.all(plugins);
    }

    private sendError = (reason: any): void => {
        const producer = this.serviceContainer.resolve<SelectTransformPluginsProducer>(SERVICE_TYPES.SelectTransformPluginsProducer);
        producer.error(reason);
    }
    
    install(pluginPackage: PluginPackage): void {
        const dataService = this.serviceContainer
        .resolve<SelectTransformPluginsDataService>(SERVICE_TYPES.SelectTransformPluginsDataService);

        dataService.install(pluginPackage)
            .then(this.sendAll)
            .catch(this.sendError);
    }
    
    uninstall(pluginPackage: PluginPackage): void {
        const dataService = this.serviceContainer
        .resolve<SelectTransformPluginsDataService>(SERVICE_TYPES.SelectTransformPluginsDataService);
        dataService.uninstall(pluginPackage)
            .then(this.sendAll)
            .catch(this.sendError);
    }

}

