import { PackageProducer } from './package.producer';
import { PluginPackageList } from '../../../../shared/models';
import { IpcService } from '../../../../shared/services';
import { PackagesEvents } from '../../../../shared/events';
import { serialize } from 'typescript-json-serializer';

export class AppPackageProducer implements PackageProducer {

    private ipcService: IpcService;

    constructor(ipcService: IpcService) {
        this.ipcService = ipcService;
    }

    all(pluginPackageList: PluginPackageList): void {
        const json = serialize(pluginPackageList);
        this.ipcService.send(PackagesEvents.GetAllListeners, json);
    }

}
