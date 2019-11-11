import { Subject } from 'rxjs';
import { Plugin } from '../../../../shared/models';

export abstract class FetchPluginsService {

    public fetchPluginsChanged: Subject<Plugin[]>;
    
    constructor() {
        this.fetchPluginsChanged = new Subject<Plugin[]>();
    }

    abstract all(): Plugin[];
}
