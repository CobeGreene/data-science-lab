import { PackageDataService } from './package.data-service';
import { PluginPackage, PluginPackageList, Plugin } from '../../../../shared/models';


export class MockPackageDataService implements PackageDataService {


    all: (callback?: (pluginPackageList: PluginPackageList) => void, error?: (reason: any) => void) => PluginPackageList;

    read: (name: string) => PluginPackage;

    install: (pluginPackage: PluginPackage) => Promise<void>;

    uninstall: (name: string) => Promise<void>;

    find: (plugin: Plugin) => PluginPackage;
    
    constructor() {
        this.reset();
    }
    
    reset() {
        this.all = () => new PluginPackageList();
        this.read = () => { throw new Error(`Not found.`); };
        this.install = () => { throw new Error('Not implemented'); };
        this.uninstall = () => { throw new Error('Not implemented'); };
        this.find = () => { throw new Error('Not implemented'); };
    }




}
