import { PluginPackage, Plugin } from '../../../../shared/models';

export interface PluginManagerAdapter {
    install(pluginPackage: PluginPackage): Promise<void>;
    uninstall(pluginPackage: PluginPackage): Promise<void>;
    activate<T>(pluginPackage: PluginPackage, plugin: Plugin): Promise<T>;
    deactivate<T>(pluginPackage: PluginPackage): Promise<void>;
    deactivateAll(): Promise<void>;
}
