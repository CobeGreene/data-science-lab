import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { PackagesEvents } from '../../../../shared/events';
import { PackageService } from '../../services';
import { PluginPackage } from '../../../../shared/models';


export class AppPackageConsumer implements Consumer {
    
    constructor(private serviceContainer: ServiceContainer) {

    }

    
    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(PackagesEvents.GetAllEvent, this.getAllEvent);
        ipcService.on(PackagesEvents.InstallEvent, this.installEvent);
        ipcService.on(PackagesEvents.UninstallEvent, this.uninstallEvent);
    }    
    
    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(PackagesEvents.GetAllEvent, this.getAllEvent);
        ipcService.removeListener(PackagesEvents.InstallEvent, this.installEvent);
        ipcService.removeListener(PackagesEvents.UninstallEvent, this.uninstallEvent);
    }

    private getAllEvent = (_event, _arg): void => {
        const packageService = this.serviceContainer.resolve<PackageService>(SERVICE_TYPES.PackageService);
        packageService.all();
    }

    private installEvent = (_event, pluginPackage: PluginPackage): void => {
        const packageService = this.serviceContainer.resolve<PackageService>(SERVICE_TYPES.PackageService);
        packageService.install(pluginPackage);
    }
    
    private uninstallEvent = (_event, pluginPackage: PluginPackage): void => {
        const packageService = this.serviceContainer.resolve<PackageService>(SERVICE_TYPES.PackageService);
        packageService.uninstall(pluginPackage);
    }




}

