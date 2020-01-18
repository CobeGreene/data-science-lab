import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { VisualizationPluginsService } from './visualization-plugins.service';
import { VisualizationPluginViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

@Injectable()
export class AppVisualizationPluginsService extends VisualizationPluginsService implements OnDestroy {
    
    private retrive: boolean;
    private visualizationPlugins: VisualizationPluginViewModel[];
    private selectedDataGroupPlugins: { dataGroupId: number, plugin: VisualizationPluginViewModel }[];
    private selectedAlgorithmPlugins: { algorithmId: number, plugin: VisualizationPluginViewModel }[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.retrive = false;
        this.visualizationPlugins = [];
        this.selectedDataGroupPlugins = [];
        this.selectedAlgorithmPlugins = [];

        this.registerEvents();
    }

    registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllVisualizationPluginsListeners, this.getAllEvent);
    }

    private getAllEvent = (event, plugins: VisualizationPluginViewModel[]) => {
        this.zone.run(() => {
            this.retrive = true;
            this.visualizationPlugins = plugins;
            this.visualizationPluginsChanged.next(this.visualizationPlugins);
        });
    }

    ngOnDestroy() {
        this.ipcService.removeListener(ExperimentsEvents.GetAllVisualizationPluginsListeners, this.getAllEvent);
    }
    
    all(): VisualizationPluginViewModel[] {
        if (!this.retrive) {
            this.ipcService.send(ExperimentsEvents.GetAllVisualizationPluginsEvent);
        }
        return this.visualizationPlugins;
    }    
    
    getDataGroup(dataGroupId: number): VisualizationPluginViewModel {
        const find = this.selectedDataGroupPlugins.find((value) => {
            return value.dataGroupId === dataGroupId;
        });
        if (find) {
            return find.plugin;
        }
        throw new Error(`Couldn't find selected plugin with data group id ${dataGroupId}`);
    }
    
    
    getAlgorithm(algorithmId: number): VisualizationPluginViewModel {
        const find = this.selectedAlgorithmPlugins.find((value) => {
            return value.algorithmId === algorithmId;
        });
        if (find) {
            return find.plugin;
        }
        throw new Error(`Couldn't find selected plugin with algorithm id ${algorithmId}`);
    }
    
    selectDataGroup(dataGroupId: number, plugin: VisualizationPluginViewModel): void {
        let find = this.selectedDataGroupPlugins.find((value) => {
            return value.dataGroupId = dataGroupId;
        });
        if (find) {
            find.plugin = plugin;
        } else {
            find = {
                dataGroupId,
                plugin
            };
            this.selectedDataGroupPlugins.push(find);
        }
        this.visualizationPluginDataGroupSelected.next(find);
    }
    
    selectAlgorithm(algorithmId: number, plugin: VisualizationPluginViewModel): void {
        let find = this.selectedAlgorithmPlugins.find((value) => {
            return value.algorithmId = algorithmId;
        });
        if (find) {
            find.plugin = plugin;
        } else {
            find = {
                algorithmId,
                plugin
            };
            this.selectedAlgorithmPlugins.push(find);
        }
        this.visualizationPluginAlgorithmSelected.next(find);
    }
    
    deselectDataGroup(dataGroupId: number): void {
        const findIndex = this.selectedDataGroupPlugins.findIndex((value) => {
            return value.dataGroupId === dataGroupId;
        });
        if (findIndex >= 0) {
            this.selectedDataGroupPlugins.splice(findIndex, 1);
        }
    }
    
    deselectAlgorithm(algorithmId: number): void {
        const findIndex = this.selectedAlgorithmPlugins.findIndex((value) => {
            return value.algorithmId === algorithmId;
        });
        if (findIndex >= 0) {
            this.selectedAlgorithmPlugins.splice(findIndex, 1);
        }
    }


}
