import { Plugin } from '../../../../shared/models';

export interface FetchService {

    all(): void;
    create(experimentId: number, plugin: Plugin);   
}
