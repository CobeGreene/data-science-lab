import { PluginPackage, Plugin } from '../../../../shared/models'

export interface PluginContext {
    install(pluginPackage: PluginPackage): Promise<void>;
    uninstall(pluginPackage: PluginPackage): Promise<void>;
    activate<T>(pluginPackage: PluginPackage, plugin: Plugin): Promise<T>;
    deactivate(pluginPackage: PluginPackage, plugin: Plugin): Promise<void>;
    deactivateAll(): Promise<void>;
}
