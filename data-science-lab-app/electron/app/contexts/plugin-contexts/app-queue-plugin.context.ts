import { PluginContext } from './plugin.context';
import { PluginPackage, Plugin } from '../../../../shared/models';


export class AppQueuePluginContext implements PluginContext {

    private queue: { [packageName: string]: number };

    constructor(private pluginContext: PluginContext) {
        this.pluginContext = pluginContext;
        this.queue = {};
    }

    install(pluginPackage: PluginPackage): Promise<void> {
        return this.pluginContext.install(pluginPackage);
    }

    uninstall(pluginPackage: PluginPackage): Promise<void> {
        return this.pluginContext.uninstall(pluginPackage);
    }

    activate<T>(pluginPackage: PluginPackage, plugin: Plugin): Promise<T> {
        if (this.queue[pluginPackage.name]) {
            this.queue[pluginPackage.name] += 1;
        } else {
            this.queue[pluginPackage.name] = 1;
        }
        return this.pluginContext.activate(pluginPackage, plugin);
    }

    deactivate(pluginPackage: PluginPackage, plugin: Plugin): Promise<void> {
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
