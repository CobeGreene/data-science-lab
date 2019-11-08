import { PluginPackage, PluginPackageList } from '../../../../shared/models';

export interface InstalledPackageDataService {
    all(): PluginPackageList;
    read(name: string): PluginPackage;
    install(pluginPackage: PluginPackage): Promise<void>;
    uninstall(name: string): Promise<void>;
}
