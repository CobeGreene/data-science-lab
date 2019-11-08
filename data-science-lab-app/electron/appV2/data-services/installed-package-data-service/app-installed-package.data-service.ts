import { InstalledPackageDataService } from './installed-package.data-service';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { DocumentContext, PluginContext } from '../../contexts';

export class AppInstalledPackageDataService implements InstalledPackageDataService {

    readonly INSTALL_PACKAGES = 'install-packages-list';

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): PluginPackageList {
        const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
        const list = context.get<PluginPackageList>(this.INSTALL_PACKAGES, new PluginPackageList());
        return list;
    }
    
    read(name: string): PluginPackage {
        const list = this.all();
        const find = list.packages.find((value) => {
            return value.name === name;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find plugin package with name: ${name}.`);
    }

    async install(pluginPackage: PluginPackage): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const documentContext = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
                const list = documentContext.get<PluginPackageList>(this.INSTALL_PACKAGES, new PluginPackageList());
                const find = list.packages.findIndex((value) => {
                    return value.name === pluginPackage.name;
                });
                if (find >= 0) {
                    throw new Error(`Plugin package with name ${name} is already installed`);
                }
                const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
                await pluginContext.install(pluginPackage);
                pluginPackage.install = true;
                list.packages.push(pluginPackage);
                documentContext.set(this.INSTALL_PACKAGES, list);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    uninstall(name: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
            const list = context.get<PluginPackageList>(this.INSTALL_PACKAGES, new PluginPackageList());
            const find = list.packages.findIndex((value) => {
                return value.name === name;  
            });
            if (find < 0) {
                reject(new Error(`Couldn't find plugin package with name: ${name}.`));
            } else {
                const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
                try {
                    await pluginContext.uninstall(list.packages[find]);
                    list.packages.splice(find, 1);
                    context.set(this.INSTALL_PACKAGES, list);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }
        });
    }


}