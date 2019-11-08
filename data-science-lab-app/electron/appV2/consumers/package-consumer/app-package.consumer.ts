import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { PackagesEvents } from '../../../../shared/events';


export class AppPackageConsumer implements Consumer {
    
    constructor(private serviceContainer: ServiceContainer) {

    }

    
    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(PackagesEvents.GetAllEvent, this.getAllEvent);
    }    
    
    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(PackagesEvents.GetAllEvent, this.getAllEvent);
    }

    private getAllEvent = (_event, _arg): void => {

    }


}

