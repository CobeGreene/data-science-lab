import { PluginManagerAdapter } from './plugin-manager.adapter';
import { PluginPackage, Plugin } from '../../../../shared/models';


export class AppQueuePluginManagerAdpater implements PluginManagerAdapter {

    private pluginManagerAdapter: PluginManagerAdapter;

    private queue: { [packageName: string]: number };

    constructor(pluginManagerAdapter: PluginManagerAdapter) {
        this.pluginManagerAdapter = pluginManagerAdapter;
        this.queue = {};
    }

    install(pluginPackage: PluginPackage): Promise<void> {
        return this.pluginManagerAdapter.install(pluginPackage);
    }

    uninstall(pluginPackage: PluginPackage): Promise<void> {
        return this.pluginManagerAdapter.uninstall(pluginPackage);
    }

    activate<T>(pluginPackage: PluginPackage, plugin: Plugin): Promise<T> {
        if (this.queue[pluginPackage.name]) {
            this.queue[pluginPackage.name] += 1;
        } else {
            this.queue[pluginPackage.name] = 1;
        }
        return this.pluginManagerAdapter.activate(pluginPackage, plugin);
    }

    deactivate<T>(pluginPackage: PluginPackage, plugin: Plugin): Promise<void> {
        this.queue[pluginPackage.name] -= 1;
        if (this.queue[pluginPackage.name] > 0) {
            return new Promise<void>((resolve, reject) => {
                resolve();
            });
        } else {
            this.pluginManagerAdapter.deactivate(pluginPackage, plugin);
        }
    }

    deactivateAll(): Promise<void> {
        this.queue = {};
        return this.pluginManagerAdapter.deactivateAll();
    }



}
