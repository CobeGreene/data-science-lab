import { Producer } from '../producer';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';


export interface AlgorithmPluginsProducer extends Producer {

    all(plugins: AlgorithmPluginViewModel[]);
}
