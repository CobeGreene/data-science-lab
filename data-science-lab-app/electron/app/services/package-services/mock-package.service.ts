import { PackageService } from './package.service';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { serialize } from 'typescript-json-serializer';
import { PackagesEvents, ErrorEvents } from '../../../../shared/events';
import { IpService } from '../../../../shared/services';

export class MockPackageService implements PackageService {

    private packagesList: PluginPackageList;
    private ipService: IpService;

    constructor(ipService: IpService) {
        this.packagesList = new PluginPackageList();
        this.ipService = ipService;
    }

    static init(packagesList: PluginPackageList, ipService: IpService): MockPackageService {
        const service = new MockPackageService(ipService);
        service.packagesList = packagesList;
        return service;
    }

    inititalize(): void {
        this.registerGetAll();
        this.registerInstall();
        this.registerUninstall();
    }

    destory(): void {
        this.unregisterGetAll();
        this.unregisterInstall();
        this.unregisterUninstall();
    }

    private registerGetAll(): void {
        this.ipService.on(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private unregisterGetAll(): void {
        this.ipService.removeListener(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private getAllEvent = (event, arg): void => {
        const json = serialize(this.packagesList);
        this.ipService.send(PackagesEvents.GetAllListeners, json);
    }

    private registerInstall(): void {
        this.ipService.on(PackagesEvents.InstallEvent, this.installEvent);
    }

    private unregisterInstall(): void {
        this.ipService.removeListener(PackagesEvents.InstallEvent, this.installEvent);
    }

    private installEvent = (event, arg): void => {
        try {
            const name = arg[0];
            if (name == null) {
                throw new Error('No arguments pass to install');
            }
            const find = this.packagesList.packages.findIndex((value: PluginPackage) => {
                return value.name.match(name) != null;
            });
            if (find >= 0) {
                this.packagesList.packages[find].install = true;
                const json = serialize(this.packagesList);
                this.ipService.send(PackagesEvents.GetAllListeners, json);
            } else {
                throw new Error(`Couldn't find plugin with the name ${name}.`);
            }
        } catch (exception) {
            if (exception instanceof Error) {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception.message);
            } else {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception);
            }
        }
    }

    private registerUninstall(): void {
        this.ipService.on(PackagesEvents.UninstallEvent, this.uninstallEvent);
    }

    private unregisterUninstall(): void {
        this.ipService.removeListener(PackagesEvents.UninstallEvent, this.uninstallEvent);
    }

    private uninstallEvent = (event, arg): void => {
        try {
            const name = arg[0];
            if (name == null) {
                throw new Error('No arguments pass to uninstall');
            }
            const find = this.packagesList.packages.findIndex((value: PluginPackage) => {
                return value.name.match(name) != null;
            });
            if (find >= 0) {
                this.packagesList.packages[find].install = false;
                const json = serialize(this.packagesList);
                this.ipService.send(PackagesEvents.GetAllListeners, json);
            } else {
                throw new Error(`Couldn't find plugin with the name ${name}.`);
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

