import { Consumer } from '../consumer';

export abstract class ExperimentConsumer implements Consumer {
    abstract initialize(): void;
    abstract destory(): void;
}
