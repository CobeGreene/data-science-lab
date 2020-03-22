import { ServiceContainer } from './service-container';
import { SERVICE_TYPES } from './service-types';

export class AppServiceContainer implements ServiceContainer {

    private _singletons: {[key in SERVICE_TYPES]?: any};
    private _singletonInitializer: {[key in SERVICE_TYPES]?: new(serviceContainer: ServiceContainer, ...args: any) => any};
    private _transientInitializer: {[key in SERVICE_TYPES]?: new(serviceContainer: ServiceContainer, ...args: any) => any};

    constructor() {
        this._singletons = {};
        this._singletonInitializer = {};
        this._transientInitializer = {};
    }

    addSingleton<T>(initializer: new (serviceContainer: ServiceContainer, ...args: any) => T, type: SERVICE_TYPES): void {
        this._singletonInitializer[type] = initializer;
    }

    addTransient<T>(initializer: new (serviceContainer: ServiceContainer, ...args: any) => T, type: SERVICE_TYPES): void {
        this._transientInitializer[type] = initializer;
    }

    resolve<T>(type: SERVICE_TYPES, ...args: any): T {
        if (this._singletonInitializer[type]) {
            
            if (this._singletons[type]) {
                return this._singletons[type] as T;
            }

            const service = new this._singletonInitializer[type](this, ...args);
            this._singletons[type] = service;
            return service as T;

        } else if (this._transientInitializer[type]) {
            return new this._transientInitializer[type](this, ...args) as T;

        } else {
            throw new Error(`Couldn't find service of type ${type} in service container.`);
        }
    }

}
