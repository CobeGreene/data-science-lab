export interface IpService {
    send(channel: string, ...arg: any[]): void;
    on(channel: string, listener: (event: any, ...arg: any) => void): void;
    once(channel: string, listener: (event: any, ...arg: any) => void): void;
    removeListener(channel: string, listener: (event: any, arg: any) => void): void;
    removeAllListeners(channel: string): void;
}
