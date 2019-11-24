import { PluginPackage } from '../../../../shared/models';

export interface AlgorithmPluginsService {
    all(): void;
    install(pluginPackage: PluginPackage): void;
    uninstall(pluginPackage: PluginPackage): void;
}

