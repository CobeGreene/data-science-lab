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
    }

    destory(): void {
        this.unregisterGetAll();
        this.unregisterInstall();
    }

    private registerGetAll() {
        this.ipcService.on(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private unregisterGetAll() {
        this.ipcService.removeListener(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private getAllEvent = (_event, _arg): void => {
        console.log('get all event');
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
        this.packageService.install(name);
    }
}
