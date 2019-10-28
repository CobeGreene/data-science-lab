import { PackageConsumer } from './package.consumer';
import { PackageService } from '../../services/package-service/package.service';
import { IpcService } from '../../../../shared/services';
import { PackagesEvents } from '../../../../shared/events';

export class AppPackageConsumer implements PackageConsumer {

    packageService: PackageService;
    ipcService: IpcService;

    constructor(packageService: PackageService,
                ipcService: IpcService) {
        this.packageService = packageService;
        this.ipcService = ipcService;
    }

    initialize(): void {
        this.registerGetAll();
        this.registerInstall();
        this.registerUninstall();
    }

    destory(): void {
        this.unregisterGetAll();
        this.unregisterInstall();
        this.unregisterUninstall();
    }

    private registerGetAll() {
        this.ipcService.on(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private unregisterGetAll() {
        this.ipcService.removeListener(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private getAllEvent = (_event, _arg): void => {
        this.packageService.all();
    }

    private registerInstall() {
        this.ipcService.on(PackagesEvents.InstallEvent, this.installEvent);
    }

    private unregisterInstall() {
        this.ipcService.removeListener(PackagesEvents.InstallEvent, this.installEvent);
    }

    private installEvent = (_event, args: any[]): void => {
        const name = args[0] as string;
        if (!name) {
            throw new Error('Package Install Event - no name given');
        }
        this.packageService.install(name);
    }

    private registerUninstall() {
        this.ipcService.on(PackagesEvents.UninstallEvent, this.uninstallEvent);
    }
    
    private unregisterUninstall() {
        this.ipcService.removeListener(PackagesEvents.UninstallEvent, this.uninstallEvent);
    }

    private uninstallEvent = (_event, args: any[]): void => {
        const name = args[0] as string;
        if (!name) {
            throw new Error('Package Uninstall Event - no name given');
        }
        this.packageService.uninstall(name);
    }


}
