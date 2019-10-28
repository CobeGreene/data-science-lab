import { PluginPackage } from './plugin_package';

export class PluginPackageList {
    public packages: PluginPackage[];

    constructor(packages: PluginPackage[] = []) {
        this.packages = packages;
    }
}
