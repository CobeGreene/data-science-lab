export class Request {
    method: string;
    protocol: string;
    hostname: string;
    port: number;
    path: string;

    constructor(method: string, protocol: string, hostname: string, port: number, path: string) {
        this.method = method;
        this.protocol = protocol;
        this.hostname = hostname;
        this.port = port;
        this.path = path;
    }
}
