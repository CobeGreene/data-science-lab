import { SERVICE_TYPES } from './service-types';

export interface ServiceContainer {

    addSingleton<T>(initializer: new(serviceContainer: ServiceContainer, ...args: any) => T, type: SERVICE_TYPES): void;
    addTransient<T>(initializer: new(serviceContainer: ServiceContainer, ...args: any) => T, type: SERVICE_TYPES): void;
    resolve<T>(type: SERVICE_TYPES, ...args: any): T;
}
