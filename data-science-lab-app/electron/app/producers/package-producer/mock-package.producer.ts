import { PackageProducer } from './package.producer';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';

export class MockPackageProducer implements PackageProducer {
    all: (pluginPackageList: PluginPackageList) => void;

    install: (pluginPackage: PluginPackage) => void;

    uninstall: (pluginPackage: PluginPackage) => void;

    error: (reason: any) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => {};
        this.install = () => {};
        this.uninstall = () => {};
        this.error = () => {};
    }

}
