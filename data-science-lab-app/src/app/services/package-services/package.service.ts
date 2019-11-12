import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { Subject } from 'rxjs';

export abstract class PackageService {
    public packagesChanged: Subject<PluginPackageList>;

    abstract all(): PluginPackageList;
    abstract install(pluginPackage: PluginPackage): void;
    abstract uninstall(pluginPackage: PluginPackage): void;
    abstract get(name: string): PluginPackage;
}

