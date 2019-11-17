import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { TransformPluginsService } from './transform-plugins.service';
import { SelectTransformPlugin } from '../../../../shared/models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

@Injectable()
export class AppTransformPluginsService extends TransformPluginsService implements OnDestroy {

    private retrive: boolean;
    private transformPlugins: SelectTransformPlugin[];
    private selectedPlugins: { dataGroupId: number, plugin: SelectTransformPlugin }[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.retrive = false;
        this.transformPlugins = [];
        this.selectedPlugins = [];

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

    get(dataGroupId: number): SelectTransformPlugin {
        const find = this.selectedPlugins.find((value) => {
            return value.dataGroupId === dataGroupId;
        });
        if (find) {
            return find.plugin;
        }
        throw new Error(`Couldn't find selected plugin with data group id ${dataGroupId}`);
    }

    select(dataGroupId: number, plugin: SelectTransformPlugin) {
        let find = this.selectedPlugins.find((value) => {
            return value.dataGroupId === dataGroupId;
        });
        if (find) {
            find.plugin = plugin;
        } else {
            find = {
                dataGroupId,
                plugin
            };
            this.selectedPlugins.push(find);
        }
        this.transformPluginSelected.next(find);
    }

    ngOnDestroy(): void {
        this.ipcService.removeListener(ExperimentsEvents.GetAllTransformPluginsEvent, this.getAllEvent);
    }

}
