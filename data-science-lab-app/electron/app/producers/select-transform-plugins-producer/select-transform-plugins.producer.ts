import { Producer } from '../producer';
import { TransformPluginViewModel } from '../../../../shared/view-models';

export interface SelectTransformPluginsProducer extends Producer {

    all(plugins: TransformPluginViewModel[]);
}

