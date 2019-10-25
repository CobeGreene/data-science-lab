export type Listener = (event: any, ...arg: any) => void;
export abstract class IpcService {
    
    abstract send(channel: string, ...arg: any[]): void;

    abstract on(channel: string, listener: Listener): void;
    
    abstract once(channel: string, listener: Listener): void;
    
    abstract removeListener(channel: string, listener: Listener): void;
    
    abstract removeAllListeners(channel: string): void;
}
