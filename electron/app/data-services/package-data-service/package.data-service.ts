import { Package, Plugin } from '../../../../shared/models';


export interface PackageDataService {
    configure(): void;
    all(): Package[];
    install(pluginPackage: Package): Promise<Package>;
    uninstall(pluginPackage: Package): Promise<Package>;
    find(plugin: Plugin): Package;
    read(name: string): Package;

}

