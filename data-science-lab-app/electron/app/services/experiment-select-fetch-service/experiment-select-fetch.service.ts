import { Plugin } from '../../../../shared/models';

export interface ExperimentSelectFetchService {
    all(): void;
    select(id: number, plugin: Plugin);
}
