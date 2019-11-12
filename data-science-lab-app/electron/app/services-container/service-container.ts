import { SERVICE_TYPES } from './service-types';
export interface ServiceContainer {
    resolve<T>(type: SERVICE_TYPES): T;
}
