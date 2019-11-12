import { PackageDataService } from './package.data-service';
import { PluginPackage, PluginPackageList, Plugin } from '../../../../shared/models';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { DocumentContext, PluginContext } from '../../contexts';
import { WebService, Request } from 'data-science-lab-core';
import { SettingsDataService } from '../settings-data-service';

export class AppPackageDataService implements PackageDataService {

    readonly INSTALL_PACKAGES = 'install-packages-list';
    private pluginPackageList: PluginPackageList;
    private gotInstalled: boolean;
    private hasFetch: boolean;

    constructor(private serviceContainer: ServiceContainer) {
        this.pluginPackageList = new PluginPackageList();
        this.hasFetch = false;
        this.gotInstalled = false;
    }

    initial() {
        if (!this.gotInstalled) {
            const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
            this.pluginPackageList = context.get<PluginPackageList>(this.INSTALL_PACKAGES, new PluginPackageList());
            this.gotInstalled = true;
        }
    }

    all(callback?: (pluginPackageList: PluginPackageList) => void, error?: (reason: any) => void): PluginPackageList {
        this.initial();
        if (!this.hasFetch) {
            if (callback) {
                this.getPackagesFromApi().then(callback).catch(error);
                this.hasFetch = true;
            }
        }
        return this.pluginPackageList;
    }

    private async getPackagesFromApi(): Promise<PluginPackageList> {
        return new Promise<PluginPackageList>(async (resolve, reject) => {
            try {
                const webservice = this.serviceContainer.resolve<WebService>(SERVICE_TYPES.WebService);
                const settingsDataService = this.serviceContainer.resolve<SettingsDataService>(SERVICE_TYPES.SettingsDataService);
                const apiSettings = settingsDataService.readApiSettings();
                const request = new Request({
                    method: 'GET',
                    protocol: apiSettings.protocol,
                    hostname: apiSettings.hostname,
                    port: apiSettings.port,
                    path: apiSettings.pathPackages
                });
                const response = await webservice.send(request);
                if (response.statusCode === 200) {
                    const obj = JSON.parse(response.body.toString()) as any[];
                    obj.forEach(element => {
                        const find = this.pluginPackageList.packages.find((value: PluginPackage) => {
                            return value.name === element.name;
                        });
                        if (find == null) {
                            const pluginPackage = new PluginPackage({
                                name: element.name,
                                owner: element.owner,
                                repositoryName: element.repositoryName,
                                username: element.username,
                                plugins: element.plugins
                            });
                            this.pluginPackageList.packages.push(pluginPackage);
                        }
                    });
                    resolve(this.pluginPackageList);
                } else {
                    throw new Error(`Didn't get an OK response code from API.`);
                }
            } catch (reason) {
                reject(reason);
            }
        });
    }

    read(name: string): PluginPackage {
        this.initial();
        const find = this.pluginPackageList.packages.find((value) => {
            return value.name === name;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find plugin package with name: ${name}.`);
    }

    find(plugin: Plugin): PluginPackage {
        this.initial();
        const find = this.pluginPackageList.packages.find((value) => {
            return value.name === plugin.packageName;
        });
        return find;
    }

    install(pluginPackage: PluginPackage): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                this.initial();
                const find = this.pluginPackageList.packages.findIndex((value) => {
                    return value.name === pluginPackage.name;
                });
                if (find < 0) {
                    throw new Error(`Couldn't find plugin package with name ${pluginPackage.name}.`);
                } else if (this.pluginPackageList.packages[find].install) {
                    throw new Error(`Plugin package with name ${pluginPackage.name} is already installed`);
                }
                const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
                await pluginContext.install(this.pluginPackageList.packages[find]);
                this.pluginPackageList.packages[find].install = true;
                this.saveInstalledPackages();   
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }



    uninstall(name: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.initial();
            const find = this.pluginPackageList.packages.findIndex((value) => {
                return value.name === name;
            });
            if (find < 0) {
                reject(new Error(`Couldn't find plugin package with name: ${name}.`));
            } else if (!this.pluginPackageList.packages[find].install) {
                reject(new Error(`Plugin package with name ${name} is not installed`));
            } else {
                try {
                    const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
                    await pluginContext.uninstall(this.pluginPackageList.packages[find]);
                    this.pluginPackageList.packages[find].install = false;
                    this.saveInstalledPackages();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }
        });
    }

    private saveInstalledPackages(): void {
        const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
        const installPackageList = new PluginPackageList(this.pluginPackageList.packages.filter((value) => {
            return value.install;
        }));
        context.set(this.INSTALL_PACKAGES, installPackageList);
    }

}
