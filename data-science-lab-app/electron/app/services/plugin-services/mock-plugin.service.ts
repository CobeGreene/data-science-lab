import { PluginService } from './plugin.service';
import { Plugins } from '../../../../shared/models/plugins';
import { ipcMain } from 'electron';
import { serialize } from 'typescript-json-serializer';
import * as PluginsEvents from '../../../../shared/events/plugins-events';
import { win } from '../../app';

export class MockPluginService implements PluginService {

    private plugins: Plugins;

    constructor() {
        this.plugins = new Plugins();
    }

    static init(plugins: Plugins): MockPluginService {
        const service = new MockPluginService();
        service.plugins = plugins;
        return service;
    }

    inititalize(): void {
        this.registerGetAll();
    }

    destory(): void {
    }

    private registerGetAll(): void {
        console.log('registering');
        ipcMain.on(PluginsEvents.GetAllEvent, (event, arg) => {
            console.log('gotten');
            this.getAllEvent(event, arg);
        });
    }
    
    private getAllEvent(event, arg): void {
        const json = serialize(this.plugins);
        console.log(json);
        win.webContents.send(PluginsEvents.GetAllListeners, json);
    }

}
