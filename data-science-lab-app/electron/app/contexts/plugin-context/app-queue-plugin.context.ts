import { PluginContext } from './plugin.context';
import { Package, Plugin } from '../../../../shared/models';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';

export class AppQueuePluginContext implements PluginContext {

    private queue: { [packageName: string]: number };
    private pluginContext: PluginContext;

    constructor(private serviceContainer: ServiceContainer) {
        this.pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.OriginalPluginContext);
        this.queue = {};
    }
    
    configure() {
        this.pluginContext.configure();
    }

    install(pluginPackage: Package): Promise<void> {
        return this.pluginContext.install(pluginPackage);
    }

    uninstall(pluginPackage: Package): Promise<void> {
        return this.pluginContext.uninstall(pluginPackage);
    }

    activate<T>(pluginPackage: Package, plugin: Plugin): Promise<T> {
        if (this.queue[pluginPackage.name]) {
            this.queue[pluginPackage.name] += 1;
        } else {
            this.queue[pluginPackage.name] = 1;
        }
        return this.pluginContext.activate(pluginPackage, plugin);
    }

    deactivate(pluginPackage: Package, plugin: Plugin): Promise<void> {
        this.queue[pluginPackage.name] -= 1;
        if (this.queue[pluginPackage.name] > 0) {
            return new Promise<void>((resolve, reject) => {
                resolve();
            });
        } else {
            return this.pluginContext.deactivate(pluginPackage, plugin);
        }
    }

    deactivateAll(): Promise<void> {
        this.queue = {};
        return this.pluginContext.deactivateAll();
    }

}
