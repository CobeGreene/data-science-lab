import { ExperimentConsumer } from './experiment.consumer';
import { ExperimentService } from '../../services';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

export class AppExperimentConsumer implements ExperimentConsumer {

    experimentService: ExperimentService;
    ipcService: IpcService;

    constructor(experimentService: ExperimentService,
                ipcService: IpcService) {
            this.experimentService = experimentService;
            this.ipcService = ipcService;
    }

    initialize(): void {
        this.registerGetAll();
        this.registerCreate();
    }
    
    destory(): void {
        this.unregisterGetAll();
        this.unregisterCreate();
    }

    private registerGetAll() {
        this.ipcService.on(ExperimentsEvents.GetAllEvent, this.getAllEvent);
    }
    
    private unregisterGetAll() {
        this.ipcService.removeListener(ExperimentsEvents.GetAllEvent, this.getAllEvent);
    }

    private getAllEvent = (_event, _arg): void => {
        this.experimentService.all();
    }

    private registerCreate() {
        this.ipcService.on(ExperimentsEvents.CreateEvent, this.createEvent);
    }
    
    private unregisterCreate() {
        this.ipcService.removeListener(ExperimentsEvents.CreateEvent, this.createEvent);
    }

    private createEvent = (_event, _arg): void => {
        this.experimentService.create();
    }



}
