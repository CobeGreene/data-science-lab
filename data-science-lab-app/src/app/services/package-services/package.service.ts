import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { Subject } from 'rxjs';

export abstract class PackageService {
    public packagesChanged: Subject<PluginPackageList>;

    abstract all(): PluginPackageList;
    abstract install(name: string): void;
    abstract uninstall(name: string): void;
    abstract get(name: string): PluginPackage;
}

