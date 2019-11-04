import { ExperimentSelectFetchConsumer } from './experiment-select-fetch.consumer';
import { ExperimentSelectFetchService } from '../../services';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents, PackagesEvents } from '../../../../shared/events';
import { Plugin } from '../../../../shared/models';

export class AppExperimentSelectFetchConsumer implements ExperimentSelectFetchConsumer {

    experimentService: ExperimentSelectFetchService;
    ipcService: IpcService;

    constructor(experimentService: ExperimentSelectFetchService,
                ipcService: IpcService) {
            this.experimentService = experimentService;
            this.ipcService = ipcService;
    }

    initialize(): void {
        this.registerGetAllFetchPlugins();
        this.registerGetAllPluginsEvent();
        this.registerSelect();
    }
    
    destory(): void {
        this.unregisterGetAllFetchPlugins();
        this.unregisterGetAllPluginsEvent();
        this.unregisterSelect();
    }

    private registerGetAllFetchPlugins() {
        this.ipcService.on(ExperimentsEvents.GetAllFetchPluginsEvent, this.getAllFetchPlugins);
    }

    private unregisterGetAllFetchPlugins() {
        this.ipcService.removeListener(ExperimentsEvents.GetAllFetchPluginsEvent, this.getAllFetchPlugins);
    }

    private registerGetAllPluginsEvent() {
        this.ipcService.on(PackagesEvents.GetAllListeners, this.getAllFetchPlugins);
    }

    private unregisterGetAllPluginsEvent() {
        this.ipcService.removeListener(PackagesEvents.GetAllListeners, this.getAllFetchPlugins);
    }

    private getAllFetchPlugins = (_event, _arg): void => {
        this.experimentService.all();
    }

    private registerSelect() {
        this.ipcService.on(ExperimentsEvents.SelectFetchEvent, this.selectFetchPlugin);
    }
    
    private unregisterSelect() {
        this.ipcService.removeListener(ExperimentsEvents.SelectFetchEvent, this.selectFetchPlugin);
    }

    private selectFetchPlugin = (_event, args: any[]): void => {
        const id = args[0][0] as number;
        if (!id) {
            throw new Error('Select Fetch Plugin Event - no id given');
        }
        const plugin = args[0][1] as Plugin;
        if (!plugin) {
            throw new Error('Select Fetch Plugin Event - no plugin given');
        }
        
        this.experimentService.select(id, plugin);
    }



}
