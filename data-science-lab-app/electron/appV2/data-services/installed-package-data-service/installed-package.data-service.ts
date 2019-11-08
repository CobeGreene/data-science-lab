import { PluginPackage, PluginPackageList } from '../../../../shared/models';

export interface InstalledPackageDataService {
    all(): PluginPackageList;
    get(name: string): PluginPackage;
    create(pluginPackage: PluginPackage): void;
    delete(name: string): void;
}
