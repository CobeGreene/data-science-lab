import { PackageService } from './package.service';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';
import { serialize } from 'typescript-json-serializer';
import { IpService } from '../../../../shared/services';
import { PluginManager, IPluginInfo } from 'live-plugin-manager';
import { PackagesEvents, ErrorEvents } from '../../../../shared/events';
import { ApiSettings } from '../../models';
import { SettingService } from '../setting-services';
import { WebService, Request, Response } from '../web-services';

export class AppPackageService implements PackageService {
    private packagesList: PluginPackageList;
    private installPackagesList: PluginPackageList;
    private ipService: IpService;
    private fetch: boolean;
    private manager: PluginManager;
    private settingsService: SettingService;
    private webService: WebService;

    constructor(ipService: IpService, manager: PluginManager, settingsService: SettingService, webService: WebService) {
        this.ipService = ipService;
        this.manager = manager;
        this.fetch = false;
        this.settingsService = settingsService;
        this.webService = webService;

        this.installPackagesList = new PluginPackageList();
        this.packagesList = new PluginPackageList();
    }

    inititalize(): void {
        this.getInstalledPackages();
        this.registerGetAll();
        this.registerInstall();
    }

    destory(): void {
        this.unregisterGetAll();
        this.unregisterInstall();
        this.fetch = false;
        this.installPackagesList.packages = [];
        this.packagesList.packages = [];
    }

    private getInstalledPackages() {
        this.installPackagesList = this.settingsService.get<PluginPackageList>('install-packages-list', new PluginPackageList());
        this.installPackagesList.packages.forEach(element => {
            this.packagesList.packages.push(element);
        });
    }

    private getPackagesFromServer(): void {
        const apiSettings = this.settingsService.get<ApiSettings>('api-settings');
        const request = new Request({
            method: 'GET',
            protocol: apiSettings.protocol,
            hostname: apiSettings.hostname,
            port: apiSettings.port,
            path: apiSettings.pathPackages
        });
        this.webService.send(request)
            .then((value: Response) => {
                if (value.statusCode === 200) {
                    this.gotResponse(value);
                }
            }).catch((_reason) => {
                console.log(`Error: Couldn't load packages from api.`);
                this.ipService.send(ErrorEvents.ExceptionListeners, `Couldn't load packages from API.`); 
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
                        new PluginPackage(
                            element.name,
                            element.owner,
                            element.repositoryName,
                            element.username,
                            element.plugins)
                    );
            } else {
                temp.packages
                    .push(
                        new PluginPackage(
                            element.name,
                            element.owner,
                            element.repositoryName,
                            element.username,
                            element.plugins,
                            true)
                    );
            }
        });
        this.packagesList = temp;
        const json = serialize(this.packagesList);
        this.ipService.send(PackagesEvents.GetAllListeners, json);
    }
    
    private registerGetAll(): void {
        this.ipService.on(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private unregisterGetAll(): void {
        this.ipService.on(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private getAllEvent = (_event, _arg): void => {
        if (!this.fetch) {
            this.fetch = true;
            this.getPackagesFromServer();
        }
        const json = serialize(this.packagesList);
        this.ipService.send(PackagesEvents.GetAllListeners, json);
    }

    private registerInstall(): void {
        this.ipService.on(PackagesEvents.InstallEvent, this.installEvent);
    }

    private unregisterInstall(): void {
        this.ipService.removeListener(PackagesEvents.InstallEvent, this.installEvent);
    }

    private installEvent = (_event, arg): void => {
        try {
            const name = arg[0];
            const find = this.packagesList.packages.findIndex((value: PluginPackage) => {
                return value.name.match(name) != null;
            });
            if (find >= 0) {
                const pluginPackage = this.packagesList.packages[find];
                this.manager.installFromGithub(`${pluginPackage.owner}/${pluginPackage.repositoryName}`)
                    .then((value: IPluginInfo) => {
                        pluginPackage.install = true;
                        this.installPackagesList.packages.push(pluginPackage);
                        this.settingsService.set('install-packages-list', this.installPackagesList);
                        const json = serialize(this.packagesList);
                        this.ipService.send(PackagesEvents.GetAllListeners, json);
                    })
                    .catch((_reason: any) => {
                        this.ipService.send(ErrorEvents.ExceptionListeners, `Unable to install packages: ${pluginPackage.name}`);
                    });
            } else {
                throw new Error(`Couldn't find package with the name ${name}.`);
            }
        } catch (exception) {
            if (exception instanceof Error) {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception.message);
            } else {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception);
            }
        }
    }
}
