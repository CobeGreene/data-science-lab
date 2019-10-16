import { PluginService } from './plugin.service';
import { Plugins } from '../../../../shared/models/plugins';
import { serialize } from 'typescript-json-serializer';
import * as PluginsEvents from '../../../../shared/events/plugins-events';
import { IpService } from '../app-services/ip.service';

export class MockPluginService implements PluginService {

    private plugins: Plugins;
    private ipService: IpService;

    constructor(ipService: IpService) {
        this.plugins = new Plugins();
        this.ipService = ipService;
    }

    static init(plugins: Plugins, ipService: IpService): MockPluginService {
        const service = new MockPluginService(ipService);
        service.plugins = plugins;
        return service;
    }

    inititalize(): void {
        this.registerGetAll();
    }

    destory(): void {
        this.unregisterGetAll();
    }

    private unregisterGetAll(): void {
        this.ipService.removeListener(PluginsEvents.GetAllEvent, this.getAllEvent);
    }

    private registerGetAll(): void {
        this.ipService.on(PluginsEvents.GetAllEvent, this.getAllEvent);
    }

    private getAllEvent = (event, arg): void => {
        const json = serialize(this.plugins);
        this.ipService.send(PluginsEvents.GetAllListeners, json);
    }

}
