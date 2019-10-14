import { Plugin } from '../../../../shared/models/plugin';
import { Subject } from 'rxjs';

export abstract class PluginService {

    public pluginsChanged: Subject<Plugin[]>;

    abstract all(): Plugin[];
    abstract install(name: string): void;
    abstract uninstall(name: string): void;
    abstract get(name: string): Plugin;
}
