import { WebService } from './web.service';
import { Request } from './request';
import { Response } from './response';
import { net } from 'electron';

export class AppWebService implements WebService {

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
                    const retResponse = new Response(response.statusCode, total);
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
