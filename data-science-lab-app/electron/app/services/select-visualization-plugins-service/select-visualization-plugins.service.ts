import { PluginPackage } from '../../../../shared/models';

export interface SelectVisualizationPluginsService {
    all(): void;
    install(pluginPackage: PluginPackage): void;
    uninstall(pluginPackage: PluginPackage): void;
}

