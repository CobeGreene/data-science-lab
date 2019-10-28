import { PluginPackageList } from '../../../../shared/models';

export abstract class PackageProducer {
    abstract all(pluginPackageList: PluginPackageList): void;
}
