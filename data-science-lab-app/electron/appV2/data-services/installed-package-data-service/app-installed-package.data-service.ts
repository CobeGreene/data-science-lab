import { InstalledPackageDataService } from './installed-package.data-service';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { DocumentContext } from '../../contexts';

export class AppInstalledPackageDataService implements InstalledPackageDataService {

    readonly INSTALL_PACKAGES = 'install-packages-list';

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): PluginPackageList {
        const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
        const list = context.get<PluginPackageList>(this.INSTALL_PACKAGES, new PluginPackageList());
        return list;
    }    
    
    get(name: string): PluginPackage {
        const find = this.all().packages.find((value) => {
            return value.name === name;
        });
        if (find) {
            throw new Error(`Couldn't find plugin package with name: ${name}.`);
        }
        return find;
    }

    create(pluginPackage: PluginPackage): void {
        const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
        const list = context.get<PluginPackageList>(this.INSTALL_PACKAGES, new PluginPackageList());
        list.packages.push(pluginPackage);
        context.set(this.INSTALL_PACKAGES, list);
    }
    delete(name: string): void {
        const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
        const list = context.get<PluginPackageList>(this.INSTALL_PACKAGES, new PluginPackageList());
        const find = list.packages.findIndex((value) => {
            return value.name === name;
        });
        if (find < 0) {
            throw new Error(`Couldn't find plugin package with name: ${name}.`);
        }
        list.packages.splice(find, 1);
        context.set(this.INSTALL_PACKAGES, list);
    }

    
}