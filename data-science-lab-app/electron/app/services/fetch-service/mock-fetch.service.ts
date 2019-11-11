import { FetchService } from './fetch.service';
import { Plugin } from '../../../../shared/models';

export class MockFetchService implements FetchService {
    all: () => void;
    
    create: (experimentId: number, plugin: Plugin) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = (): void => {};
        this.create = (): void => {};
    }


}
