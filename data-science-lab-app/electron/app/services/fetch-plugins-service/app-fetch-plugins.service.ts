import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { Plugin } from '../../../../shared/models';
import { PackageDataService } from '../../data-services';
import { FetchPluginsProducer } from '../../producers';
import { FetchPluginsService } from './fetch-plugins.service';
import { PluginTypes } from 'data-science-lab-core';


export class AppFetchPluginsService implements FetchPluginsService {
    
    constructor(private serviceContainer: ServiceContainer) {

    }
    
    all(): void {
        const dataService = this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        const plugins: Plugin[] = [];
        
        dataService.all().packages.filter((value) => {
            return value.install;
        }).forEach((value) => {
            value.plugins.forEach((plugin) => {
                if (plugin.type === PluginTypes.Fetch) {
                    plugin.packageName = value.name;
                    plugins.push(plugin);
                }
            });
        });

        const producer = this.serviceContainer.resolve<FetchPluginsProducer>(SERVICE_TYPES.FetchPluginsProducer);
        producer.all(plugins);
    }

}
