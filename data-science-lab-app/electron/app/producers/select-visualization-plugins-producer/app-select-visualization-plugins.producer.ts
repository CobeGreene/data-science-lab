import { BaseProducer } from '../base.producer';
import { SelectVisualizationPluginsProducer  } from './select-visualization-plugins.producer';
import { VisualizationPluginViewModel } from '../../../../shared/view-models';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';
import { IpcService } from '../../../../shared/services';


export class AppSelectVisualizationPluginsProducer extends BaseProducer implements SelectVisualizationPluginsProducer {
    all(plugins: VisualizationPluginViewModel[]) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.GetAllVisualizationPluginsListeners, plugins);
    }

}

