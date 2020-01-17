import { BaseProducer } from '../base.producer';
import { AlgorithmPluginsProducer  } from './algorithm-plugins.producer';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';
import { IpcService } from '../../../../shared/services';


export class AppAlgorithmPluginsProducer extends BaseProducer implements AlgorithmPluginsProducer {
    all(plugins: AlgorithmPluginViewModel[]) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.GetAllAlgorithmPluginsListeners, plugins);
    }

}

