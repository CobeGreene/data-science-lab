export type Listener = (event: any, ...arg: any) => void;
export interface IpService {
    
    send(channel: string, ...arg: any[]): void;

    on(channel: string, listener: Listener): void;
    
    once(channel: string, listener: Listener): void;
    
    removeListener(channel: string, listener: Listener): void;
    
    removeAllListeners(channel: string): void;
}
