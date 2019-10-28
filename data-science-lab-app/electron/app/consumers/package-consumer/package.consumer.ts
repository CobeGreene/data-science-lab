import { Consumer } from '../consumer';

export abstract class PackageConsumer implements Consumer {
    abstract initialize(): void;
    abstract destory(): void;
}
