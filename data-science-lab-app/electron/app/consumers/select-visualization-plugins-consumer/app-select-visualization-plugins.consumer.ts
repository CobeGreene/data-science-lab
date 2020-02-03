import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { PackagesEvents, ExperimentsEvents } from '../../../../shared/events';
import { PluginPackage } from '../../../../shared/models';
import { SelectVisualizationPluginsService } from '../../services';


export class AppSelectVisualizationPluginsConsumer implements Consumer {

    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllVisualizationPluginsEvent, this.getAllEvent);
        ipcService.on(PackagesEvents.InstallListeners, this.installEvent);
        ipcService.on(PackagesEvents.UninstallListeners, this.uninstallEvent);
    }

    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllVisualizationPluginsEvent, this.getAllEvent);
        ipcService.removeListener(PackagesEvents.InstallListeners, this.installEvent);
        ipcService.removeListener(PackagesEvents.UninstallListeners, this.uninstallEvent);
    }

    private uninstallEvent = (event, pluginPackage: PluginPackage) => {
        const service = this.serviceContainer.resolve<SelectVisualizationPluginsService>(SERVICE_TYPES.SelectVisualizationPluginsService);
        service.uninstall(pluginPackage);
    }

    private installEvent = (event, pluginPackage: PluginPackage) => {
        const service = this.serviceContainer.resolve<SelectVisualizationPluginsService>(SERVICE_TYPES.SelectVisualizationPluginsService);
        service.install(pluginPackage);
    }

    private getAllEvent = (_event, _arg): void => {
        const service = this.serviceContainer.resolve<SelectVisualizationPluginsService>(SERVICE_TYPES.SelectVisualizationPluginsService);
        service.all();
    }

}



