import { WebService, Request, Response } from 'data-science-lab-core';


export class MockWebCoreService implements WebService {
    send: (request: Request) => Promise<Response>;

    constructor() {
        this.reset();
    }

    reset() {
        this.send = (request: Request) => {
            return new Promise<Response>((resolve, _) => {
                resolve();
            });
        };
    }
}
