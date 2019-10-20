export class Response {
    statusCode: number;
    body?: Buffer;

    constructor(statusCode: number, body?: Buffer) {
        this.statusCode = statusCode;
        this.body = body; 
    }
}
