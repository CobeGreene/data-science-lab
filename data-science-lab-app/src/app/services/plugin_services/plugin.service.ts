import { Observable } from 'rxjs';
import { Plugin } from '../../../../shared/models/plugin';

export abstract class PluginService {
    abstract all(): Promise<Plugin[]>;
}
