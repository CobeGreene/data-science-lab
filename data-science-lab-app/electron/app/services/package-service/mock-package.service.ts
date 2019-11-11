import { PackageService } from "./package.service";
import { PluginPackage, PluginPackageList } from '../../../../shared/models';


export class MockPackageService implements PackageService {

    constructor() {
        this.reset();
    }    
    all: () => void;
    install: (pluginPackage: PluginPackage) => void;
    uninstall: (pluginPackage: PluginPackage) => void;

    reset() {
        this.all = () => {};
        this.install = (_) => {};
        this.uninstall = (_) => {};
    }

    
}
