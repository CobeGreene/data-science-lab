import { ErrorException } from './error-exception';

export class ErrorExceptionList {
    public errors: ErrorException[];

    constructor(errors: ErrorException[] = []) {
        this.errors = errors;
    }
}
