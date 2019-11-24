import { BaseProducer } from '../base.producer';
import { SelectTransformPluginsProducer } from './select-transform-plugins.producer';
import { TransformPluginViewModel } from '../../../../shared/view-models';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';
import { IpcService } from '../../../../shared/services';


export class AppSelectTransformPluginsProducer extends BaseProducer implements SelectTransformPluginsProducer {
    all(plugins: TransformPluginViewModel[]) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.GetAllTransformPluginsListeners, plugins);
    }

}

