import { Service, ServiceContainer, SERVICE_TYPES } from '../service-container';
import { IpcService } from '../../../shared/services';
import * as Events from '../../../shared/events';

export class Producer extends Service {
    
    private ipc: IpcService;
    
    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);
        this.ipc = serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
    }

    send(event: string, ...arg: any) {
        this.ipc.send(`${event}${Events.Deliminator}${Events.Listener}`, ...arg);
    }
    
}
