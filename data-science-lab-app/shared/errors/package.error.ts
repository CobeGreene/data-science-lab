import { SystemError } from './system.error';

export interface PackageError extends SystemError {
    issues: string;
}
