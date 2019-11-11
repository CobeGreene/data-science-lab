import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { FetchPluginsService } from './fetch-plugins.service';
import { Plugin } from '../../../../shared/models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';


@Injectable()
export class AppFetchPluginsService extends FetchPluginsService implements OnDestroy {

    private retrive: boolean;
    private fetchPlugins: Plugin[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.retrive = false;
        this.fetchPlugins = [];

        this.registerEvents();
    }

    registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllFetchPluginsListeners, this.getAllEvent);
    }

    private getAllEvent = (event, plugins: Plugin[]): void => {
        this.zone.run(() => {
            this.retrive = true;
            this.fetchPlugins = plugins;
            this.fetchPluginsChanged.next(this.fetchPlugins);
        });
    }

    all(): Plugin[] {
        if (!this.retrive) {
            this.ipcService.send(ExperimentsEvents.GetAllFetchPluginsEvent);
        }
        return this.fetchPlugins;
    }

    ngOnDestroy() {
        this.ipcService.removeListener(ExperimentsEvents.GetAllFetchPluginsListeners, this.getAllEvent);
    }
}

