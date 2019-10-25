import { IpcService, Listener } from './ipc.service';

export class MockIpcService implements IpcService {
    
    onceListeners: { [channel: string]: Listener[]};
    listeners: { [channel: string]: Listener[] };

    constructor() {
        this.onceListeners = {};
        this.listeners = {};
    }

    send(channel: string, ...arg: any[]): void {
        if (this.onceListeners[channel] != null) {
            this.onceListeners[channel].forEach(element => {
                element(channel, arg);
            });
            this.onceListeners[channel] = [];
        }
        if (this.listeners[channel] != null) {
            this.listeners[channel].forEach(element => {
                element(channel, arg);
            });
        }
    }    
    
    on(channel: string, listener: Listener): void {
        if (this.listeners[channel] == null) {
            this.listeners[channel] = [];
        }
        this.listeners[channel].push(listener);
    }

    once(channel: string, listener: Listener): void {
        if (this.onceListeners[channel] == null) {
            this.onceListeners[channel] = [];
        }
        this.onceListeners[channel].push(listener);
    }

    removeListener(channel: string, listener: Listener): void {
        if (this.onceListeners[channel] != null) {
            const find = this.onceListeners[channel].findIndex((value) => {
                return listener.name === value.name;
            });
            if (find >= 0) {
                this.onceListeners[channel].splice(find, 1);
            }
        }
        if (this.listeners[channel] != null) {
            const find = this.listeners[channel].findIndex((value) => {
                return listener.name === value.name;
            });
            if (find >= 0) {
                this.listeners[channel].splice(find, 1);
            }
        }
    }

    removeAllListeners(channel: string): void {
        this.onceListeners[channel] = [];
        this.listeners[channel] = [];
    }

    removeListenersFromAllChannels(): void {
        this.onceListeners = {};
        this.listeners = {};
    }

}
