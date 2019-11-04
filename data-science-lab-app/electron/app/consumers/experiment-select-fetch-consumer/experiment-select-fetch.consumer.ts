import { Consumer } from '../consumer';

export abstract class ExperimentSelectFetchConsumer implements Consumer {
    abstract initialize(): void;
    abstract destory(): void;
}
