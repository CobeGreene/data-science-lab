import { Service, SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { Producer } from '../../pipeline';
import { SessionPlugin, Package, Plugin } from '../../../../shared/models';
import { SessionPluginDataService } from './session-plugin.data-service';
import { PackageDataService } from '../package-data-service';
import { PluginContext } from '../../contexts/plugin-context';
import { ErrorEvent, PackageEvents } from '../../../../shared/events';
import { PluginTypes, PluginInputs } from 'data-science-lab-core';


export class AppSessionPluginDataService extends Service implements SessionPluginDataService {

    private plugins: SessionPlugin[];
    private retrieve: boolean;

    get producer(): Producer {
        return this.serviceContainer.resolve<Producer>(SERVICE_TYPES.Producer);
    }

    get dataService(): PackageDataService {
        return this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
    }

    get context(): PluginContext {
        return this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.plugins = [];
        this.retrieve = false;
    }

    all(): SessionPlugin[] {
        if (!this.retrieve) {
            this.retrieve = true;
            this.getPackagesFromDataService();
        }
        return this.plugins;
    }

    async install(pluginPackage: Package) {
        await this.addPlugins(pluginPackage);
    }

    async uninstall(pluginPackage: Package) {
        this.plugins = this.plugins.filter((value) => {
            return value.packageName !== pluginPackage.name;
        });
    }

    async getPackagesFromDataService() {
        const packages = this.dataService.all().filter(value => value.install);
        for (const pluginPackage of packages) {
            await this.addPlugins(pluginPackage);
        }
        this.producer.send(PackageEvents.SessionChange);
    }

    async addPlugins(pluginPackage: Package) {
        if (!this.plugins.find((value) => value.packageName === pluginPackage.name)) {
            for (const plugin of pluginPackage.plugins) {
                try {
                    if (plugin.type !== PluginTypes.Fetch) {
                        const pluginObj = await this.context.activate<{ getInputs(): PluginInputs }>(pluginPackage, plugin);
    
                        const sessionPlugin: SessionPlugin = {
                            name: plugin.name,
                            className: plugin.className,
                            description: plugin.description,
                            inputs: pluginObj.getInputs().inputs(),
                            type: plugin.type,
                            packageName: pluginPackage.name
                        };
    
                        this.plugins.push(sessionPlugin);
    
                        await this.context.deactivate(pluginPackage, plugin); 
                    }
                } catch (error) {
                    this.producer.send(ErrorEvent, error);
                }
            }
        }
    }


}
