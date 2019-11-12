import { BaseProducer } from '../base.producer';
import { FetchPluginsProducer } from './fetch-plugins.producer';
import { Plugin } from '../../../../shared/models';
import { ExperimentsEvents } from '../../../../shared/events';
import { SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';


export class AppFetchPluginsProducer extends BaseProducer implements FetchPluginsProducer {
    
    all(plugins: Plugin[]) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.GetAllFetchPluginsListeners, plugins);
    }
    
}

