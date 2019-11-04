import { Consumer } from '../consumer';

export abstract class ExperimentSetupInputConsumer implements Consumer {
    abstract initialize(): void;
    abstract destory(): void;
}
