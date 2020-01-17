import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { TransformPluginsService } from './transform-plugins.service';
import { TransformPluginViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

@Injectable()
export class AppTransformPluginsService extends TransformPluginsService implements OnDestroy {

    private retrive: boolean;
    private transformPlugins: TransformPluginViewModel[];
    private selectedPlugins: { dataGroupId: number, plugin: TransformPluginViewModel }[];

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

    private getAllEvent = (event, plugins: TransformPluginViewModel[]) => {
        this.zone.run(() => {
            this.retrive = true;
            this.transformPlugins = plugins;
            this.transformPluginsChanged.next(this.transformPlugins);
        });
    }

    all(): TransformPluginViewModel[] {
        if (!this.retrive) {
            this.ipcService.send(ExperimentsEvents.GetAllTransformPluginsEvent);
        }
        return this.transformPlugins;
    }

    get(dataGroupId: number): TransformPluginViewModel {
        const find = this.selectedPlugins.find((value) => {
            return value.dataGroupId === dataGroupId;
        });
        if (find) {
            return find.plugin;
        }
        throw new Error(`Couldn't find selected plugin with data group id ${dataGroupId}`);
    }

    select(dataGroupId: number, plugin: TransformPluginViewModel) {
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

    deselect(dataGroupId: number) {
        const findIndex = this.selectedPlugins.findIndex((value) => {
            return value.dataGroupId === dataGroupId;
        });
        if (findIndex >= 0) {
            this.selectedPlugins.splice(findIndex, 1);
        }
    }

    ngOnDestroy(): void {
        this.ipcService.removeListener(ExperimentsEvents.GetAllTransformPluginsListeners, this.getAllEvent);
    }

}
