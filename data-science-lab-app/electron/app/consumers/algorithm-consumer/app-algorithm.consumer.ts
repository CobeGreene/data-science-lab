import { Consumer } from '../consumer';
import { SERVICE_TYPES, ServiceContainer } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { AlgorithmService } from '../../services';

export class AppAlgorithmConsumer implements Consumer {

    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize() {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllAlgorithmsEvent, this.getAllEvent);
        ipcService.on(ExperimentsEvents.DeleteAlgorithmEvent, this.deleteEvent);
        ipcService.on(ExperimentsEvents.StartAlgorithmEvent, this.startEvent);
        ipcService.on(ExperimentsEvents.StopAlgorithmEvent, this.stopEvent);
    }


    private stopEvent = (event, id: number) => {
        const service = this.serviceContainer.resolve<AlgorithmService>(SERVICE_TYPES.AlgorithmService);
        service.stop(id);
    }

    private startEvent = (event, id: number) => {
        const service = this.serviceContainer.resolve<AlgorithmService>(SERVICE_TYPES.AlgorithmService);
        service.start(id);
    }

    private deleteEvent = (event, id: number) => {
        const service = this.serviceContainer.resolve<AlgorithmService>(SERVICE_TYPES.AlgorithmService);
        service.delete(id);
    }

    private getAllEvent = (event, args: any) => {
        const service = this.serviceContainer.resolve<AlgorithmService>(SERVICE_TYPES.AlgorithmService);
        service.all();
    }
    
    destory() {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllAlgorithmsEvent, this.getAllEvent);
        ipcService.removeListener(ExperimentsEvents.DeleteAlgorithmEvent, this.deleteEvent);
        ipcService.removeListener(ExperimentsEvents.StartAlgorithmEvent, this.startEvent);
        ipcService.removeListener(ExperimentsEvents.StopAlgorithmEvent, this.stopEvent);
    }



}

