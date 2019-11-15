import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { TransformPluginsService } from './transform-plugins.service';
import { SelectTransformPlugin } from '../../../../shared/models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

@Injectable()
export class AppTransformPluginsService extends TransformPluginsService implements OnDestroy {
    
    private retrive: boolean;
    private transformPlugins: SelectTransformPlugin[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.retrive = false;
        this.transformPlugins = [];

        this.registerEvents();
    }

    registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllTransformPluginsListeners, this.getAllEvent);
    }

    private getAllEvent = (event, plugins: SelectTransformPlugin[]) => {
        this.zone.run(() => {
            this.retrive = true;
            this.transformPlugins = plugins;
            this.transformPluginsChanged.next(this.transformPlugins);
        });
    }
    
    all(): SelectTransformPlugin[] {
        if (!this.retrive) {
            this.ipcService.send(ExperimentsEvents.GetAllTransformPluginsEvent);
        }
        return this.transformPlugins;
    }
    
    ngOnDestroy(): void {
        this.ipcService.removeListener(ExperimentsEvents.GetAllTransformPluginsEvent, this.getAllEvent);
    }

}
