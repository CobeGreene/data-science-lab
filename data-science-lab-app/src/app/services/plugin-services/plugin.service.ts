import { Plugin } from '../../../../shared/models/plugin';
import { Subject } from 'rxjs';

export abstract class PluginService {

    public pluginsChanged: Subject<Plugin[]>;

    abstract all(): Plugin[];
    abstract install(plugin: Plugin): void;
    abstract get(name: string): Plugin;
}
