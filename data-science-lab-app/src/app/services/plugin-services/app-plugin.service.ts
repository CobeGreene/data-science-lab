import { PluginService } from './plugin.service';
import { Plugin, Plugins } from '../../../../shared/models';
import * as PluginsEvents from '../../../../shared/events/plugins-events';
import * as ErrorEvents from '../../../../shared/events/error-events';
import { OnInit, OnDestroy, Injectable } from '@angular/core';
import { IpService } from '../../../../shared/services/ip.service';
import { Subject } from 'rxjs';
import { deserialize } from 'typescript-json-serializer';

@Injectable()
export class AppPluginService implements PluginService, OnDestroy {

    public pluginsChanged: Subject<Plugin[]>;    

    private plugins: Plugin[];
    private retrieve: boolean;  

    constructor(private ipService: IpService) {
        this.pluginsChanged = new Subject<Plugin[]>();
        this.plugins = [];
        this.retrieve = false;
        this.registerGetAll();
    }


    ngOnDestroy(): void {
        this.unregisterGetAll();
    }
    
    all(): Plugin[] {
        if (!this.retrieve) {
            this.ipService.send(PluginsEvents.GetAllEvent);
        }
        return this.plugins.slice();
    }

    install(name: string): void {
        this.ipService.send(PluginsEvents.InstallEvent, name);
    }

    uninstall(name: string): void {
        this.ipService.send(PluginsEvents.UninstallEvent, name);
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

    private registerGetAll(): void {
        this.ipService.on(PluginsEvents.GetAllListeners, this.getAllEvent);
    }   
    
    private unregisterGetAll(): void {
        this.ipService.removeListener(PluginsEvents.GetAllListeners, this.getAllEvent);
    }

    private getAllEvent = (event, arg): void => {
        try {
            const value = deserialize<Plugins>(arg[0], Plugins);
            this.plugins = value.plugins;
            this.retrieve = true;
            this.pluginsChanged.next(this.all());
        } catch (exception) {
            if (exception instanceof Error) {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception.message);
            } else {
                this.ipService.send(ErrorEvents.ExceptionListeners, exception);   
            }
        }
    }


}
