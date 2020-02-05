import { PluginPackage } from '../../../../shared/models';


export interface SelectTransformPluginsService {
    all(): void;
    install(pluginPackage: PluginPackage): void;
    uninstall(pluginPackage: PluginPackage): void;
}

