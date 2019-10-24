export class ErrorException {
    id: number;
    message: string;

    constructor(error: {id?: number, message: string}) {
        this.id = error.id || 0;
        this.message = error.message;
    }
}
