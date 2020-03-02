import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { PackageDataService } from './package.data-service';
import { Plugin, Package } from '../../../../shared/models';
import { SettingsContext } from '../../contexts/settings-context';
import { PluginContext } from '../../contexts/plugin-context';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import { Producer } from '../../pipeline';
import { WebService } from 'data-science-lab-core';
import { ApiSettings } from '../../models';
import { PackageEvents, ErrorEvent } from '../../../../shared/events';

export class AppPackageDataService extends Service implements PackageDataService {
    private readonly key = 'packages';
    private readonly api = 'api-settings';
    private packages: Package[];
    private retrieve: boolean;

    get settings(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    get producer(): Producer {
        return this.serviceContainer.resolve<Producer>(SERVICE_TYPES.Producer);
    }

    get web(): WebService {
        return this.serviceContainer.resolve<WebService>(SERVICE_TYPES.WebService);
    }

    get context(): PluginContext {
        return this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.packages = [];
        this.retrieve = false;
    }

    configure() {
        this.packages = this.settings.get<Package[]>(this.key, []);
        this.packages.forEach(value => value.install = true);
    }

    private save() {
        const installed = this.packages.filter(value => value.install);
        this.settings.set(this.key, installed);
    }

    all() {
        if (!this.retrieve) {
            this.retrieve = true;
            this.getPackageFromApi();
        }
        return this.packages;
    }

    async install(pluginPackage: Package): Promise<Package> {
        const find = this.read(pluginPackage.name);
        await this.context.install(pluginPackage);
        find.install = true;
        this.save();
        return find;
    }

    async uninstall(pluginPackage: Package): Promise<Package> {
        const find = this.read(pluginPackage.name);
        await this.context.uninstall(pluginPackage);
        find.install = false;
        this.save();
        return find;
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

    notFound(name: string): SystemError {
        return {
            header: 'Package Error',
            description: `Unable to find package with name: ${name}`,
            type: ErrorTypes.Error
        };
    }

    unableConnect(): SystemError {
        return {
            header: 'API Connection',
            description: 'Unable to get packages from api will only used the ones install.',
            type: ErrorTypes.Warning
        };
    }

    async getPackageFromApi() {
        const api = this.settings.get<ApiSettings>(this.api);
        try {
            const response = await this.web.send({
                method: 'GET',
                protocol: api.protocol,
                hostname: api.hostname,
                port: api.port,
                path: api.pathPackages
            });
    
            if (response.statusCode === 200) {
                const obj = JSON.parse(response.body.toString()) as any[];
    
                obj.forEach(element => {
                    const find = this.packages.find((value: Package) => {
                        return value.name === element.name;
                    });
                    if (find == null) {
                        const pluginPackage = {
                            name: element.name,
                            owner: element.owner,
                            repositoryName: element.repositoryName,
                            username: element.username,
                            install: false,
                            plugins: element.plugins.map(value => ({
                                name: value.name,
                                className: value.className,
                                description: value.description,
                                type: value.type,
                                packageName: element.name
                            }))
                        };
                        this.packages.push(pluginPackage);
                    }
                });
    
                this.producer.send(PackageEvents.Change);
            } else {
                this.producer.send(ErrorEvent, this.unableConnect());
            }
        } catch (error) {
            this.producer.send(ErrorEvent, this.unableConnect());
        }

    }
}

