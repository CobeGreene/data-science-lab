import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents, PackagesEvents } from '../../../../shared/events';
import { FetchPluginsService } from '../../services';
import { PluginPackage } from '../../../../shared/models';

export class AppFetchPluginsConsumer implements Consumer {

    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllFetchPluginsEvent, this.getAllEvent);
        ipcService.on(PackagesEvents.InstallListeners, this.getAllEvent);
        ipcService.on(PackagesEvents.UninstallListeners, this.getAllEvent);
    }

    getAllEvent = (_event: string, ...args): void => {
        const service = this.serviceContainer.resolve<FetchPluginsService>(SERVICE_TYPES.FetchPluginsService);
        service.all();
    }

    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllFetchPluginsEvent, this.getAllEvent);
        ipcService.removeListener(PackagesEvents.InstallListeners, this.getAllEvent);
        ipcService.removeListener(PackagesEvents.UninstallListeners, this.getAllEvent);
    }
}
