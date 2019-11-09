import { PackageProducer } from './package.producer';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';
import { IpcService } from '../../../../shared/services';
import { SERVICE_TYPES } from '../../services-container';
import { PackagesEvents } from '../../../../shared/events';
import { BaseProducer } from '../base.producer';

export class AppPackageProducer extends BaseProducer implements PackageProducer {
    all(pluginPackageList: PluginPackageList) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(PackagesEvents.GetAllListeners, pluginPackageList);
    }    
    
    install(pluginPackage: PluginPackage) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(PackagesEvents.InstallListeners, pluginPackage);
    }
    
    uninstall(pluginPackage: PluginPackage) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(PackagesEvents.UninstallListeners, pluginPackage);
    }
}

