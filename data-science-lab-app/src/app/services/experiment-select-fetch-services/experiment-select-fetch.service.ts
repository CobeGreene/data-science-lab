import { Subject } from 'rxjs';
import { Plugin } from '../../../../shared/models';

export abstract class ExperimentSelectFetchService {
    public fetchPlugins: Subject<Plugin[]>;

    abstract all(): Plugin[];
    abstract select(id: number, plugin: Plugin): void;
}
