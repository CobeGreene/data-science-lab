import { PackageService } from './package.service';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { serialize } from 'typescript-json-serializer';
import { PackagesEvents, ErrorEvents } from '../../../../shared/events';
import { IpcService } from '../../../../shared/services';

export class MockPackageService implements PackageService {

    private packagesList: PluginPackageList;
    private ipcService: IpcService;

    constructor(ipcService: IpcService) {
        this.packagesList = new PluginPackageList();
        this.ipcService = ipcService;
    }

    static init(packagesList: PluginPackageList, ipService: IpcService): MockPackageService {
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
        this.ipcService.on(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private unregisterGetAll(): void {
        this.ipcService.removeListener(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private getAllEvent = (event, arg): void => {
        const json = serialize(this.packagesList);
        this.ipcService.send(PackagesEvents.GetAllListeners, json);
    }

    private registerInstall(): void {
        this.ipcService.on(PackagesEvents.InstallEvent, this.installEvent);
    }

    private unregisterInstall(): void {
        this.ipcService.removeListener(PackagesEvents.InstallEvent, this.installEvent);
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
                this.ipcService.send(PackagesEvents.GetAllListeners, json);
            } else {
                throw new Error(`Couldn't find plugin with the name ${name}.`);
            }
        } catch (exception) {
            if (exception instanceof Error) {
                this.ipcService.send(ErrorEvents.ExceptionListeners, exception.message);
            } else {
                this.ipcService.send(ErrorEvents.ExceptionListeners, exception);
            }
        }
    }

    private registerUninstall(): void {
        this.ipcService.on(PackagesEvents.UninstallEvent, this.uninstallEvent);
    }

    private unregisterUninstall(): void {
        this.ipcService.removeListener(PackagesEvents.UninstallEvent, this.uninstallEvent);
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
                this.ipcService.send(PackagesEvents.GetAllListeners, json);
            } else {
                throw new Error(`Couldn't find plugin with the name ${name}.`);
            }

        } catch (exception) {
            if (exception instanceof Error) {
                this.ipcService.send(ErrorEvents.ExceptionListeners, exception.message);
            } else {
                this.ipcService.send(ErrorEvents.ExceptionListeners, exception);
            }
        }
    }

}

