import { PluginPackage } from '../../../../shared/models';

export interface PackageService {
    all(): void;
    install(pluginPackage: PluginPackage): void;
    uninstall(pluginPackage: PluginPackage): void;
}
