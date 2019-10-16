import { PluginService } from './plugin.service';
import { Plugins, Plugin } from '../../../../shared/models';
import { serialize } from 'typescript-json-serializer';
import * as PluginsEvents from '../../../../shared/events/plugins-events';
import * as ErrorEvents from '../../../../shared/events/error-events';
import { IpService } from '../../../../shared/services/ip.service';

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
        this.registerInstall();
        this.registerUninstall();
    }
    
    destory(): void {
        this.unregisterGetAll();
        this.unregisterInstall();
        this.unregisterUninstall();
    }

    private registerGetAll(): void {
        this.ipService.on(PluginsEvents.GetAllEvent, this.getAllEvent);
    }

    private unregisterGetAll(): void {
        this.ipService.removeListener(PluginsEvents.GetAllEvent, this.getAllEvent);
    }

    private getAllEvent = (event, arg): void => {
        const json = serialize(this.plugins);
        this.ipService.send(PluginsEvents.GetAllListeners, json);
    }

    private registerInstall(): void {
        this.ipService.on(PluginsEvents.InstallEvent, this.installEvent);
    }

    private unregisterInstall(): void {
        this.ipService.removeListener(PluginsEvents.InstallEvent, this.installEvent);
    }

    private installEvent = (event, arg): void => {
        try {
            const name = arg[0];
            const find = this.plugins.plugins.findIndex((plugin: Plugin) => {
                return plugin.name === name;
            });
            if (find >= 0) {
                this.plugins.plugins[find].install = true;
                const json = serialize(this.plugins);
                this.ipService.send(PluginsEvents.GetAllListeners, json);
            } else {
                throw new Error(`Couldn't find plugin with the name ${name}.`);
            }
        } catch (exception) {
            if (exception instanceof Error) {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception.message);
            } else {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception);
            }
        }
    }

    private registerUninstall(): void {
        this.ipService.on(PluginsEvents.UninstallEvent, this.uninstallEvent);
    }
    
    private unregisterUninstall(): void {
        this.ipService.removeListener(PluginsEvents.UninstallEvent, this.uninstallEvent);
    }

    private uninstallEvent = (event, arg): void => {
        try {
            const name = arg[0];
            const find = this.plugins.plugins.findIndex((plugin: Plugin) => {
                return plugin.name === name;
            });
            if (find >= 0) {
                this.plugins.plugins[find].install = false;
                const json = serialize(this.plugins);
                this.ipService.send(PluginsEvents.GetAllListeners, json);
            } else {
                throw new Error(`Couldn't find plugin with the name ${name}.`);
            }

        } catch (exception) {
            if (exception instanceof Error) {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception.message);
            } else {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception);
            }
        }
    }

}
