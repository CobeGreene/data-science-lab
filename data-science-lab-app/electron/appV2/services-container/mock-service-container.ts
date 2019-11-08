import { SERVICE_TYPES } from './service-types';
import { ServiceContainer } from './service-container';

export class MockServiceContainer implements ServiceContainer {
    
    public getType: (type: SERVICE_TYPES) => any;

    constructor() {
        this.reset();
    }
    
    reset() {
        this.getType = (_) => { throw new Error(`Couldn't resolve`); };
    }

    resolve<T>(type: SERVICE_TYPES): T {
        return this.getType(type) as T;
    }

}
