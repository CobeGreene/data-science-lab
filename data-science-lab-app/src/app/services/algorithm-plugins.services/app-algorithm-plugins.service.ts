import { AlgorithmPluginsService } from './algorithm-plugins.service';
import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';


@Injectable()
export class AppAlgorithmPluginsService extends AlgorithmPluginsService implements OnDestroy {

    private retrive: boolean;
    private algorithmPlugins: AlgorithmPluginViewModel[];
    private selectedPlugins: { dataGroupId: number, plugin: AlgorithmPluginViewModel }[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.retrive = false;
        this.algorithmPlugins = [];
        this.selectedPlugins = [];

        this.registerEvents();
    }

    registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllAlgorithmPluginsListeners, this.getAllEvent);
    }

    private getAllEvent = (event, plugins: AlgorithmPluginViewModel[]) => {
        this.zone.run(() => {
            this.retrive = true;
            this.algorithmPlugins = plugins;
            this.algorithmPluginsChanged.next(this.algorithmPlugins);
        });
    }


    all(): AlgorithmPluginViewModel[] {
        if (!this.retrive) {
            this.ipcService.send(ExperimentsEvents.GetAllAlgorithmPluginsEvent);
        }
        return this.algorithmPlugins;
    }
    get(dataGroupId: number): AlgorithmPluginViewModel {
        const find = this.selectedPlugins.find((value) => {
            return value.dataGroupId === dataGroupId;
        });
        if (find) {
            return find.plugin;
        }
        throw new Error(`Couldn't find selected plugin with data group id ${dataGroupId}`);
    }

    select(dataGroupId: number, plugin: AlgorithmPluginViewModel): void {
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
        this.algorithmPluginSelected.next(find);
    }
    deselect(dataGroupId: number): void {
        const findIndex = this.selectedPlugins.findIndex((value) => {
            return value.dataGroupId === dataGroupId;
        });
        if (findIndex >= 0) {
            this.selectedPlugins.splice(findIndex, 1);
        }
    }
    ngOnDestroy(): void {
        this.ipcService.removeListener(ExperimentsEvents.GetAllAlgorithmPluginsListeners, this.getAllEvent);
    }

}

