import { IpcService, Listener } from '../../../../shared/services';

export class AppIpcService implements IpcService {
    send(channel: string, ...arg: any[]): void {
        window.electronIpcSend(channel, arg);
    }    
    
    on(channel: string, listener: Listener): void {
        window.electronIpcOn(channel, listener);
    }
    once(channel: string, listener: Listener): void {
        window.electronIpcOnce(channel, listener);
    }

    removeListener(channel: string, listener: Listener): void {
        window.electronIpcRemoveListener(channel, listener);
    }
    removeAllListeners(channel: string): void {
        window.electronIpcRemoveAllListeners(channel);
    }

}
