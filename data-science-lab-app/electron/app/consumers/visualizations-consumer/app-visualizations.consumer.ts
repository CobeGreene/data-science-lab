import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { VisualizationsService } from '../../services';

export class AppVisualizationsConsumer implements Consumer {

    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllVisualizationsEvent, this.getAllEvent);
        ipcService.on(ExperimentsEvents.DeleteVisualizationsEvent, this.deleteEvent);
    }    


    private deleteEvent = (event, id: number) => {
        const service = this.serviceContainer.resolve<VisualizationsService>(SERVICE_TYPES.VisualizationsService);
        service.delete(id);
    }

    private getAllEvent = (event, args) => {
        const service = this.serviceContainer.resolve<VisualizationsService>(SERVICE_TYPES.VisualizationsService);
        service.all();
    }
    
    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllVisualizationsEvent, this.getAllEvent);
        ipcService.removeListener(ExperimentsEvents.DeleteVisualizationsEvent, this.deleteEvent);
    }


}

