import { PackageService } from './package.service';
import { SettingService } from '../setting-services/setting.service';
import { WebService, Request, Response } from 'data-science-lab-core';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';
import { PackageProducer } from '../../producers/package-producer/package.producer';
import { ApiSettings } from '../../models';
import { PluginManagerAdapter } from '../../adapters';

export class AppPackageService implements PackageService {

    private readonly INSTALL_PACKAGES = 'install-packages-list';

    private packageProducer: PackageProducer;
    private settingService: SettingService;
    private webService: WebService;
    private packagesList: PluginPackageList;
    private fetch: boolean;
    private manager: PluginManagerAdapter;

    constructor(packageProducer: PackageProducer,
                settingService: SettingService,
                webService: WebService,
                pluginManagerAdapter: PluginManagerAdapter) {
        this.packageProducer = packageProducer;
        this.settingService = settingService;
        this.webService = webService;

        this.packagesList = this.settingService.get<PluginPackageList>('install-packages-list', new PluginPackageList());
        this.fetch = false;
        this.manager = pluginManagerAdapter;

    }

    all(): void {
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
        this.webService.send(request)
            .then((value: Response) => {
                if (value.statusCode === 200) {
                    this.gotResponse(value);
                } else {
                    throw new Error('Couldn\'t get successful response to the API.');
                }
            });
    }

    private gotResponse(respones: Response) {
        const obj = JSON.parse(respones.body.toString());
        obj.forEach(element => {
            const find = this.packagesList.packages.find((value: PluginPackage) => {
                return value.name.match(element.name);
            });
            if (find == null) {
                const pluginPackage = new PluginPackage({
                    name: element.name,
                    owner: element.owner,
                    repositoryName: element.repositoryName,
                    username: element.username,
                    plugins: element.plugins
                });
                this.packagesList.packages.push(pluginPackage);
            }
        });
        this.packageProducer.all(this.packagesList);
    }

    install(name: string): void {
        const find = this.packagesList.packages.findIndex((value: PluginPackage) => {
            return !value.install && value.name.match(name) != null;
        });
        if (find >= 0) {
            const pluginPackage = this.packagesList.packages[find];
            this.manager.install(pluginPackage)
                .then(() => {
                    pluginPackage.install = true;
                    this.saveInstallPackages();
                    this.packageProducer.all(this.packagesList);
                });
        } else {
            throw new Error(`Couldn't find an uninstall package with the name ${name}.`);
        }
    }

    uninstall(name: string): void {
        console.log('uninstall event');
        const find = this.packagesList.packages.findIndex((value: PluginPackage) => {
            return value.install && value.name.match(name) != null;
        });
        if (find >= 0) {
            console.log('found uninstall package');
            this.manager.uninstall(this.packagesList.packages[find]).then(() => {
                console.log('updating install packages');
                this.packagesList.packages[find].install = false;
                this.saveInstallPackages();
                this.packageProducer.all(this.packagesList);
            });
        } else {
            throw new Error(`Couldn't find an install package with the name ${name}.`);
        }
    }


    private saveInstallPackages(): void {
        const installPackageList = new PluginPackageList(this.packagesList.packages.filter((value: PluginPackage) => {
            return value.install;
        }));
        this.settingService.set(this.INSTALL_PACKAGES, installPackageList);
    }
}
