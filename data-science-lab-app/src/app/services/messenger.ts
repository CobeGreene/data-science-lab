import { IpcService, Listener } from '../../../shared/services';
import * as Events from '../../../shared/events';
import { Injectable } from '@angular/core';

@Injectable()
export class Messenger {
    constructor(private ipcService: IpcService) {

    }

    publish(event: string, ...args: any) {
        this.ipcService.send(`${event}${Events.Deliminator}${Events.Event}`, ...args);
    }

    subscribe(event: string, listener: Listener) {
        this.ipcService.on(`${event}${Events.Deliminator}${Events.Listener}`, listener);
    }
    
    unsubscribe(event: string, listener: Listener) {
        this.ipcService.removeListener(`${event}${Events.Deliminator}${Events.Listener}`, listener);
    }
}
