import { PackageProducer } from './package.producer';
import { PluginPackageList } from '../../../../shared/models';
import { IpcService } from '../../../../shared/services';
import { PackagesEvents } from '../../../../shared/events';
import { IpcProducer } from '../ipc.producer';

export class AppPackageProducer extends IpcProducer implements PackageProducer  {

    constructor(ipcService: IpcService) {
        super(ipcService);
    }

    all(pluginPackageList: PluginPackageList): void {
        this.ipcService.send(PackagesEvents.GetAllListeners, pluginPackageList);
    }

}
