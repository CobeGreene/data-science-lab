import { FetchSessionService } from './fetch.session-service';
import { FetchSession } from '../../models/fetch-session';
import { Plugin, PluginPackage } from '../../../../shared/models';


export class MockFetchSessionService implements FetchSessionService {

    all: () => FetchSession[];
    read: (experimentId: number) => FetchSession;
    create: (experimentId: number, pluginPackage: PluginPackage, plugin: Plugin) => Promise<FetchSession>;
    delete: (experimentId: number) => void;


    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => [];
        this.read = () => { throw new Error('Not implemented'); };
        this.create = () => { throw new Error('Not implemented'); };
        this.delete = () => { };
    }
}

