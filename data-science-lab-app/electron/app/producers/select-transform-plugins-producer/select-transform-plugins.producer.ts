import { Producer } from '../producer';
import { SelectTransformPlugin } from '../../../../shared/models';

export interface SelectTransformPluginsProducer extends Producer {

    all(plugins: SelectTransformPlugin[]);
}

