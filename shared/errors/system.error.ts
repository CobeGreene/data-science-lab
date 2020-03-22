import { ErrorTypes } from './error-types';

export interface SystemError {
    header: string;
    description: string;
    type: ErrorTypes;
}
