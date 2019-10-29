import { PluginPackageList } from '../../../../shared/models';
import { IpcProducer } from '../ipc.producer';
import { IpcService } from '../../../../shared/services';

export abstract class PackageProducer {

    abstract error(reason: any): void;
    abstract all(pluginPackageList: PluginPackageList): void;
}
