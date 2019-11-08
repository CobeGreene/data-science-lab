import { PluginPackageList } from '../../../../shared/models';

export interface AllPackageDataService {
    all(callback?: (pluginPackageList: PluginPackageList) => void, error?: (reason: any) => void): PluginPackageList;
}
