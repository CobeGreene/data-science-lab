import { ExperimentSelectFetchService } from './experiment-select-fetch.service';
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Plugin } from '../../../../shared/models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents, ErrorEvents } from '../../../../shared/events';

@Injectable() 
export class AppExperimentSelectFetchService implements ExperimentSelectFetchService, OnDestroy {
    public fetchPlugins: Subject<Plugin[]>;
    private pluginList: Plugin[];
    private retrieve: boolean;

    constructor(private ipcService: IpcService, private zone: NgZone) {
        this.fetchPlugins = new Subject<Plugin[]>();
        this.pluginList = [];
        this.retrieve = false;
        this.registerGetAll();
    }

    ngOnDestroy() {
        this.unregisterGetAll();
    }

    private registerGetAll(): void {
        this.ipcService.on(ExperimentsEvents.GetAllFetchPluginsListener, this.getAllEvent);
    }

    private unregisterGetAll(): void {
        this.ipcService.removeListener(ExperimentsEvents.GetAllFetchPluginsListener, this.getAllEvent);
    }

    private getAllEvent = (event, arg): void => {
        this.zone.run(() => {
            try {
                const value = JSON.parse(arg[0]) as Plugin[];
                this.pluginList = value;
                this.retrieve = true;
                this.fetchPlugins.next(this.pluginList);
            } catch (exception) {
                if (exception instanceof Error) {
                    this.ipcService.send(ErrorEvents.ExceptionListeners, exception.message);
                } else {
                    this.ipcService.send(ErrorEvents.ExceptionListeners, exception);
                }
            }
        });
    }

    all(): Plugin[] {
        if (!this.retrieve) {
            this.ipcService.send(ExperimentsEvents.GetAllFetchPluginsEvent);
        }
        return this.pluginList;
    }

    select(id: number, plugin: Plugin): void {
        const pluginJson = JSON.stringify(plugin);
        this.ipcService.send(ExperimentsEvents.SelectFetchEvent, id, pluginJson);
    }

}
