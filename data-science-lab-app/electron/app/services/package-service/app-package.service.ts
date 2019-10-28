import { PackageService } from './package.service';
import { SettingService } from '../setting-services/setting.service';
import { WebService, Request, Response } from 'data-science-lab-core';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';
import { PackageProducer } from '../../producers/package-producer/package.producer';
import { ApiSettings } from '../../models';
import { PluginManager, IPluginInfo } from 'live-plugin-manager' ;

export class AppPackageService implements PackageService {

    private readonly INSTALL_PACKAGES = 'install-packages-list';

    private packageProducer: PackageProducer;
    private settingService: SettingService;
    private webService: WebService;
    private installPackagesList: PluginPackageList;
    private packagesList: PluginPackageList;
    private fetch: boolean;
    private manager: PluginManager;

    constructor(packageProducer: PackageProducer,
                settingService: SettingService,
                webService: WebService) {
        this.packageProducer = packageProducer;
        this.settingService = settingService;
        this.webService = webService;

        this.installPackagesList = this.settingService.get<PluginPackageList>('install-packages-list', new PluginPackageList());
        this.installPackagesList.packages.forEach(element => {
            this.packagesList.packages.push(element);
        });

        console.log(`plugins path: ${this.settingService.get('plugins-package')}`);
        this.fetch = false;
        this.manager = new PluginManager({
            pluginsPath: this.settingService.get('plugins-package')
        });
    }

    all(): void {
        console.log('plugins service');
        if (!this.fetch) {
            this.fetch = true;
            this.getPackagesFromServer();
        }
        this.packageProducer.all(this.packagesList);
    }

    private getPackagesFromServer() {
        const apiSettings = this.settingService.get<ApiSettings>('api-settings');
        const request = new Request({
            method: 'GET',
            protocol: apiSettings.protocol,
            hostname: apiSettings.hostname,
            port: apiSettings.port,
            path: apiSettings.pathPackages
        });
        console.log('sending web request');
        this.webService.send(request)
            .then((value: Response) => {
                if (value.statusCode === 200) {
                    this.gotResponse(value);
                }
            }).catch((_reason) => {
                // this.ipService.send(ErrorEvents.ExceptionListeners, `Couldn't load packages from API.`);
            });
    }

    private gotResponse(respones: Response) {
        const obj = JSON.parse(respones.body.toString());
        const temp = new PluginPackageList();
        obj.forEach(element => {
            const find = this.installPackagesList.packages.find((value: PluginPackage) => {
                return value.name.match(element.name);
            });
            if (find == null) {
                temp.packages
                    .push(
                        new PluginPackage({
                            name: element.name,
                            owner: element.owner,
                            repositoryName: element.repositoryName,
                            username: element.username,
                            plugins: element.plugins
                        })
                    );
            } else {
                temp.packages
                    .push(
                        new PluginPackage({
                            name: element.name,
                            owner: element.owner,
                            repositoryName: element.repositoryName,
                            username: element.username,
                            plugins: element.plugins,
                            install: true
                        })
                    );
            }
        });
        this.packagesList = temp;
        this.packageProducer.all(this.packagesList);
    }

    install(name: string): void {
        try {
            const find = this.packagesList.packages.findIndex((value: PluginPackage) => {
                return value.name.match(name) != null;
            });
            if (find >= 0) {
                const pluginPackage = this.packagesList.packages[find];
                this.manager.installFromGithub(`${pluginPackage.owner}/${pluginPackage.repositoryName}`)
                    .then((value: IPluginInfo) => {
                        pluginPackage.install = true;
                        this.installPackagesList.packages.push(pluginPackage);
                        this.settingService.set(this.INSTALL_PACKAGES, this.installPackagesList);
                        // const json = serialize(this.packagesList);
                        // this.ipService.send(PackagesEvents.GetAllListeners, json);
                        this.packageProducer.all(this.packagesList);
                    })
                    .catch((_reason: any) => {
                        // this.ipService.send(ErrorEvents.ExceptionListeners, `Unable to install packages: ${pluginPackage.name}`);
                    });
            } else {
                throw new Error(`Couldn't find package with the name ${name}.`);
            }
        } catch (exception) {
            if (exception instanceof Error) {
                // this.ipService.send(ErrorEvents.ExceptionListeners, exception.message);
            } else {
                // this.ipService.send(ErrorEvents.ExceptionListeners, exception);
            }
        }
    }
    uninstall(name: string): void {
        throw new Error('Method not implemented.');
    }


}
