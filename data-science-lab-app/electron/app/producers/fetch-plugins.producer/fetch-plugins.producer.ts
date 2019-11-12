import { Producer } from '../producer';
import { Plugin } from '../../../../shared/models';


export interface FetchPluginsProducer extends Producer {
    all(plugins: Plugin[]);
}

