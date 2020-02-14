import { Consumer } from '../consumer';
import { SERVICE_TYPES, ServiceContainer } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { AlgorithmTrackerService } from '../../services';

export class AppAlgorithmTrackerConsumer implements Consumer {

    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize() {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllAlgorithmTrackerEvent, this.getAllEvent);
    }

    getAllEvent = (event) => {
        const service = this.serviceContainer.resolve<AlgorithmTrackerService>(SERVICE_TYPES.AlgorithmTrackerService);
        service.all();
    }

    destory() {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllAlgorithmTrackerEvent, this.getAllEvent);
    }

}



