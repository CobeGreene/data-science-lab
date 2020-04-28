import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { PackageDataService } from './package.data-service';
import { Plugin, Package } from '../../../../shared/models';
import { SettingsContext } from '../../contexts/settings-context';
import { PluginContext } from '../../contexts/plugin-context';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import { Producer } from '../../pipeline';

export class AppPackageDataService extends Service implements PackageDataService {
    private readonly key = 'packages';
    private packages: Package[];

    get settings(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    get producer(): Producer {
        return this.serviceContainer.resolve<Producer>(SERVICE_TYPES.Producer);
    }

    get context(): PluginContext {
        return this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.packages = [];
    }

    configure() {
        this.packages = this.settings.get<Package[]>(this.key, []);
        this.packages.forEach(value => value.install = true);
    }

    private save() {
        this.settings.set(this.key, this.packages);
    }

    all() {
        return this.packages;
    }

    async install(pluginPackage: Package): Promise<Package> {
        if (this.has(pluginPackage.name)) {
            throw this.alreadyInstall(pluginPackage.name);
        }
        await this.context.install(pluginPackage);
        pluginPackage.install = true;
        this.packages.push(pluginPackage);
        this.save();
        return pluginPackage;
    }

    async uninstall(pluginPackage: Package): Promise<Package> {
        const index = this.packages.findIndex((value) => value.name === pluginPackage.name);
        if (index >= 0) {
            await this.context.uninstall(pluginPackage);
            this.packages.splice(index, 1);
            this.save();
            return pluginPackage;
        } else {
            throw this.notInstalled(pluginPackage.name);
        }
    }

    find(plugin: Plugin): Package {
        const find = this.packages.find((value) => {
            return value.name === plugin.packageName;
        });
        return find;
    }

    read(name: string): Package {
        const find = this.packages.find((value) => {
            return value.name === name;
        });
        if (find) {
            return find;
        }
        throw this.notFound(name);
    }

    has(name: string): boolean {
        const find = this.packages.find((value) => {
            return value.name === name;
        });
        return !!find;
    }

    notFound(name: string): SystemError {
        return {
            header: 'Package Error',
            description: `Unable to find package with name: ${name}`,
            type: ErrorTypes.Error
        };
    }

    alreadyInstall(name: string): SystemError {
        return {
            header: 'Package Error',
            description: `Package ${name} is already installed.`,
            type: ErrorTypes.Error
        };
    }

    notInstalled(name: string): SystemError {
        return {
            header: 'Package Error',
            description: `Package ${name} isn't installed.`,
            type: ErrorTypes.Error
        };
    }
}

