import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { FetchService } from '../../services';
import { Plugin } from '../../../../shared/models';


export class AppFetchSessionConsumer implements Consumer {

    constructor(private serviceContainer: ServiceContainer) {

    }
    
    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllFetchSessionsEvent, this.getAllEvent);
        ipcService.on(ExperimentsEvents.CreateFetchSessionEvent, this.createEvent);
    }    


    private createEvent = (_event, experimentId: number, plugin: Plugin): void => {
        const fetchService = this.serviceContainer.resolve<FetchService>(SERVICE_TYPES.FetchService);
        fetchService.create(experimentId, plugin);
    }

    private getAllEvent = (_event, _arg): void => {
        const fetchService = this.serviceContainer.resolve<FetchService>(SERVICE_TYPES.FetchService);
        fetchService.all();
    }
    
    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllFetchSessionsEvent, this.getAllEvent);
        ipcService.removeListener(ExperimentsEvents.CreateFetchSessionEvent, this.createEvent);
    }



}
