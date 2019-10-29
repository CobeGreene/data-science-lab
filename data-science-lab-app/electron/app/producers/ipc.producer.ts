import { IpcService } from '../../../shared/services';
import { ErrorEvents } from '../../../shared/events';

export class IpcProducer {
    protected ipcService: IpcService;

    constructor(ipcService: IpcService) {
        this.ipcService = ipcService; 
    }

    error(reason: any): void {
        if (reason instanceof Error) {
            this.ipcService.send(ErrorEvents.ExceptionListeners, reason.message);
        } else {
            this.ipcService.send(ErrorEvents.ExceptionListeners, reason);
        }
    }
}
