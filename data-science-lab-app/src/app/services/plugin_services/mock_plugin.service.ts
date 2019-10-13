import { PluginService } from './plugin.service';
import { Plugin } from '../../../../shared/models/plugin';

export class MockPluginService implements PluginService {

    plugins: Plugin[];

    constructor() {
        this.plugins = [];
    }

    static init(plugins: Plugin[]): MockPluginService {
        const service = new MockPluginService();
        service.plugins = plugins.slice();
        return service;
    }

    all() {
        return new Promise<Plugin[]>((resolve, reject) => {
            resolve(this.plugins);
        });
    }

}
