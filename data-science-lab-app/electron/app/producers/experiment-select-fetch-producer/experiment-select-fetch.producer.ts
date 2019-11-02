import { Plugin } from '../../../../shared/models';

export abstract class ExperimentSelectFetchProducer {
    abstract all(plugins: Plugin[]): void;
    abstract error(reason: any): void;
}
