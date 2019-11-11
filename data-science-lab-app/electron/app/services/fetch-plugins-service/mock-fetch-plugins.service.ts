import { FetchPluginsService } from './fetch-plugins.service';


export class MockFetchPluginsService implements FetchPluginsService {
    
    all: () => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => {};
    }
}
