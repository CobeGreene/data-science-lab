import { net } from 'electron';
import { Request, Response, WebService } from 'data-science-lab-core';

export class AppWebService implements WebService {

    constructor() {
        
    }

    send(request: Request): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            const appRequest = net.request({
                method: request.method,
                protocol: request.protocol,
                hostanme: request.hostname,
                port: request.port,
                path: request.path
            });
            appRequest.on('response', (response) => {
                let total = null;
                response.on('data', (chunk) => {
                    if (total == null) {
                        total = chunk;
                    } else {
                        total += chunk;
                    }
                });
                response.on('end', () => {
                    const retResponse = new Response({
                        statusCode: response.statusCode,
                        body: total
                    });
                    resolve(retResponse);
                });
                response.on('error', (error) => {
                    reject(error);
                });
            });
            appRequest.on('error', (error: Error) => {
                reject(error);
            });
            appRequest.end();
        });
    }
}
