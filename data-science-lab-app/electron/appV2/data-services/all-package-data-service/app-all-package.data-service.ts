import { AllPackageDataService } from './all-package.data-service';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { WebService, Request } from 'data-science-lab-core';
import { SettingsDataService } from '../settings-data-service';
import { InstalledPackageDataService } from '../installed-package-data-service';


export class AppAllPackageDataService implements AllPackageDataService {

    private allPluginPackageList?: PluginPackageList;

    constructor(private serviceContainer: ServiceContainer) {
        this.allPluginPackageList = null;
    }

    private async fetch(callback: (pluginPackageList: PluginPackageList) => void, error?: (reason: any) => void): Promise<void> {
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
        try {
            const response = await webservice.send(request);
            if (response.statusCode === 200) {
                const installPackageService = this.serviceContainer
                    .resolve<InstalledPackageDataService>(SERVICE_TYPES.InstalledPackageDataService);
                this.allPluginPackageList = installPackageService.all();
                const obj = JSON.parse(response.body.toString()) as any[];
                obj.filter((value) => {
                    return this.allPluginPackageList.packages.find((already) => {
                        return already.name === value.name;
                    }) === null;
                }).map((element) => {
                    return new PluginPackage({
                        name: element.name,
                        owner: element.owner,
                        repositoryName: element.repositoryName,
                        username: element.username,
                        plugins: element.plugins
                    });
                }).forEach((element) => {
                    this.allPluginPackageList.packages.push(element);
                });
                callback(this.allPluginPackageList);
            } else {
                throw new Error(`Didn't get an OK response code from API.`);
            }
        } catch (reason) {
            if (error) {
                error(reason);
            }
        }
    }

    all(callback?: (pluginPackageList: PluginPackageList) => void, error?: (reason: any) => void): PluginPackageList {
        if (callback) {
            this.fetch(callback, error);
        } else if (this.allPluginPackageList === null) {
            const installPackageService = this.serviceContainer
                .resolve<InstalledPackageDataService>(SERVICE_TYPES.InstalledPackageDataService);
            this.allPluginPackageList = installPackageService.all();
        }
        return this.allPluginPackageList;
    }

}  
