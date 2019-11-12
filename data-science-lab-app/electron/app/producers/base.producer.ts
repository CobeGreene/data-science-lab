import { ServiceContainer, SERVICE_TYPES } from '../services-container';
import { IpcService } from '../../../shared/services';
import { ErrorEvents } from '../../../shared/events';
import { Producer } from './producer';

export abstract class BaseProducer implements Producer {
    constructor(protected serviceContainer: ServiceContainer) {

    }

    error(reason: any) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        if (reason instanceof Error) {
            ipc.send(ErrorEvents.ExceptionListeners, reason.message);
        } else {
            ipc.send(ErrorEvents.ExceptionListeners, reason);
        }
    }
}
