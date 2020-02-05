import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { SessionAlgorithmTestingService } from '../../services';


export class AppAlgorithmTestingSessionConsumer implements Consumer {

    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllAlgorithmTestingSessionsEvent, this.getAll);
        ipcService.on(ExperimentsEvents.RequestAlgorithmTestingSessionEvent, this.requestEvent);
        ipcService.on(ExperimentsEvents.StartAlgorithmTestingSessionEvent, this.startTestEvent);
    }

    getAll = (event: string) => {
        const service = this.serviceContainer.resolve<SessionAlgorithmTestingService>(SERVICE_TYPES.SessionAlgorithmTestingService);
        service.all();
    }

    requestEvent = (event: string, id: number, dataGroupId: number) => {
        const service = this.serviceContainer.resolve<SessionAlgorithmTestingService>(SERVICE_TYPES.SessionAlgorithmTestingService);
        service.request(id, dataGroupId);
    }

    startTestEvent = (event: string, id: number, inputs: { [id: string]: number[]; }, output: { [id: string]: number[]; }) => {
        const service = this.serviceContainer.resolve<SessionAlgorithmTestingService>(SERVICE_TYPES.SessionAlgorithmTestingService);
        service.startTest(id, inputs, output);
    }

    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllAlgorithmTestingSessionsEvent, this.getAll);
        ipcService.removeListener(ExperimentsEvents.RequestAlgorithmTestingSessionEvent, this.requestEvent);
        ipcService.removeListener(ExperimentsEvents.StartAlgorithmTestingSessionEvent, this.startTestEvent);
    }


}


