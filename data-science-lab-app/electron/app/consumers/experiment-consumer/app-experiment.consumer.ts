import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { ExperimentService } from '../../services';

export class AppExperimentConsumer implements Consumer {

    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllEvent, this.getAllEvent);
        ipcService.on(ExperimentsEvents.CreateEvent, this.createEvent);
    }    

    destory() {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllEvent, this.getAllEvent);
        ipcService.removeListener(ExperimentsEvents.CreateEvent, this.createEvent);
    }

    private getAllEvent = (_event, _arg): void => {
        const experimentService = this.serviceContainer.resolve<ExperimentService>(SERVICE_TYPES.ExperimentService);
        experimentService.all();
    }

    private createEvent = (_event, _arg): void => {
        const experimentService = this.serviceContainer.resolve<ExperimentService>(SERVICE_TYPES.ExperimentService);
        experimentService.create();
    }

}


