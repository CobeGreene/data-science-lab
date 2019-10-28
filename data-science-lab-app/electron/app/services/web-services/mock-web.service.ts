import { WebService, Request, Response } from 'data-science-lab-core';


export class MockWebService implements WebService {
    public send: (request: Request) => Promise<Response>;

    constructor() {
        this.reset();
    }

    public reset() {
        this.send = (_) => new Promise<Response>((resolve) => {
            resolve(new Response({
                statusCode: 200
            }));
        });
    }

}
