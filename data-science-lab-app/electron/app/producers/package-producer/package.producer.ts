import { Producer } from '../producer';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';

export interface PackageProducer extends Producer {

    all(pluginPackageList: PluginPackageList);
    install(pluginPackage: PluginPackage);
    uninstall(pluginPackage: PluginPackage);
}
