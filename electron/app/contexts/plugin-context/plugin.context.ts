import { Package, Plugin } from '../../../../shared/models';


export interface PluginContext {
    configure(): void;
    install(pluginPackage: Package): Promise<void>;
    uninstall(pluginPackage: Package): Promise<void>;
    activate<T>(pluginPackage: Package, plugin: Plugin): Promise<T>;
    deactivate(pluginPackage: Package, plugin: Plugin): Promise<void>;
    deactivateAll(): Promise<void>;
}
