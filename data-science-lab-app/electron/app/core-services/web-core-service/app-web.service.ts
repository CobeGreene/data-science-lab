import { net } from 'electron';
import { WebService, Request, Response } from 'data-science-lab-core';


export class AppWebService implements WebService {
    send(request: Request): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            try {
                const netRequest = net.request({
                    method: request.method,
                    protocol: request.protocol,
                    hostanme: request.hostname,
                    port: request.port,
                    path: request.path
                });
    
                netRequest.on('response', (response) => {
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
    
                netRequest.on('error', (error) => {
                    reject(error);
                });
                netRequest.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}


