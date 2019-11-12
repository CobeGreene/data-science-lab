import { FetchPluginsProducer } from './fetch-plugins.producer';
import { Plugin } from '../../../../shared/models';


export class MockFetchPluginsProducer implements FetchPluginsProducer {
    all: (plugins: Plugin[]) => void;
    error: (reason: any) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => {};
        this.error = () => {};
    }

}
