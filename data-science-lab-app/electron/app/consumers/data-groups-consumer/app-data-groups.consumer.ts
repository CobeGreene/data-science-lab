import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { DataGroupsService } from '../../services';


export class AppDataGroupsConsumer implements Consumer {

    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllDataGroupsEvent, this.getAllEvent);
        ipcService.on(ExperimentsEvents.DeleteDataGroupEvent, this.deleteEvent);
    }    


    private deleteEvent = (event, id: number) => {
        const service = this.serviceContainer.resolve<DataGroupsService>(SERVICE_TYPES.DataGroupsService);
        service.delete(id);
    }

    private getAllEvent = (event, args) => {
        const service = this.serviceContainer.resolve<DataGroupsService>(SERVICE_TYPES.DataGroupsService);
        service.all();
    }
    
    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllDataGroupsEvent, this.getAllEvent);
        ipcService.removeListener(ExperimentsEvents.DeleteDataGroupEvent, this.deleteEvent);
    }


}

