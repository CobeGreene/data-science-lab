import { PluginPackage, PluginPackageList } from '../../../../shared/models';

export interface PackageDataService {
    all(callback?: (pluginPackageList: PluginPackageList) => void, error?: (reason: any) => void): PluginPackageList;
    read(name: string): PluginPackage;
    install(pluginPackage: PluginPackage): Promise<void>;
    uninstall(name: string): Promise<void>;
}
