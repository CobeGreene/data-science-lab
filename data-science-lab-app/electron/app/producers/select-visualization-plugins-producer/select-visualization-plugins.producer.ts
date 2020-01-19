import { Producer } from '../producer';
import { VisualizationPluginViewModel } from '../../../../shared/view-models';

export interface SelectVisualizationPluginsProducer extends Producer {

    all(plugins: VisualizationPluginViewModel[]);
}

