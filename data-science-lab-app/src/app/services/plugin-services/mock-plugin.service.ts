import { PluginService } from './plugin.service';
import { Plugin } from '../../../../shared/models/plugin';
import { Subject } from 'rxjs';

export class MockPluginService implements PluginService {
    
    public pluginsChanged: Subject<Plugin[]>;

    private plugins: Plugin[];

    constructor() {
        this.pluginsChanged = new Subject<Plugin[]>();
        this.plugins = [];
    }

    static init(plugins: Plugin[]): MockPluginService {
        const service = new MockPluginService();
        service.plugins = plugins.slice();
        return service;
    }


    all(): Plugin[] {
        return this.plugins.slice();
    }

    install(plugin: Plugin): void {
        const found = this.plugins.find((value: Plugin) => {
            return value.name === plugin.name && value.owner === plugin.owner;
        });
        if (!found) {
            throw new Error('Couldn\' find plugin');
        } else if (found.install) {
            throw new Error('Plugin already installed');
        } else {
            found.install = true;
            this.pluginsChanged.next(this.all());
        }
    }

    get(name: string): Plugin {
        const find = this.plugins.find((plugin: Plugin) => {
            return plugin.name === name;
        });
        if (find == null) {
            throw new Error('Couldn\'t find plugin');
        }  
        return find;
    }
    
}
