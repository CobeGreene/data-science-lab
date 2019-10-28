import { PluginPackage, Plugin } from '../../../../shared/models';

export interface PluginManagerAdapter {
    install(pluginPackage: PluginPackage): Promise<void>;
    uninstall(pluginPackage: PluginPackage): Promise<void>;
    get<T>(pluginPackage: PluginPackage, plugin: Plugin): Promise<T>;
}
