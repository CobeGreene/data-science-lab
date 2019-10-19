import { PackageService } from './package.service';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';
import { serialize } from 'typescript-json-serializer';
import { IpService } from '../../../../shared/services/ip.service';
import { PluginManager, IPluginInfo } from 'live-plugin-manager';
const settings = require('electron-settings');
import { net } from 'electron';
import { PackagesEvents, ErrorEvents } from '../../../../shared/events';

export class AppPackageService implements PackageService {
    private packagesList: PluginPackageList;
    private installPackagesList: PluginPackageList;
    private ipService: IpService;
    private fetch: boolean;
    private manager: PluginManager;

    constructor(ipService: IpService, manager: PluginManager) {
        this.packagesList = new PluginPackageList();
        this.ipService = ipService;
        this.manager = manager;
        this.fetch = false;
        this.installPackagesList = new PluginPackageList();
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
        this.installPackagesList = settings.get('install-packages-list', new PluginPackageList());
        this.installPackagesList.packages.forEach(element => {
            this.packagesList.packages.push(element);
        });
    }

    private getPackagesFromServer(): void {
        const request = net.request({
            method: 'GET',
            protocol: 'https:',
            hostname: 'localhost',
            port: 44339,
            path: '/api/packages'
        });
        request.on('response', (response) => {
            response.on('data', (chunk) => {
                if (response.statusCode === 200) {
                    const obj = JSON.parse(chunk.toString());
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
                this.fetch = true;
            });
            response.on('error', () => {
                console.log(`Error: Couldn't load packages from api.`);
                this.ipService.send(ErrorEvents.ExceptionListeners, `Couldn't load packages from API.`);
            });
        });
        request.on('error', (error: Error) => {
            console.log(`Error: ${error.message} from api.`);
            this.ipService.send(ErrorEvents.ExceptionListeners, error.message);
        });
        request.end();
    }

    private registerGetAll(): void {
        this.ipService.on(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private unregisterGetAll(): void {
        this.ipService.on(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private getAllEvent = (_event, _arg): void => {
        if (!this.fetch) {
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
                        settings.set('install-packages-list', this.installPackagesList);
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
