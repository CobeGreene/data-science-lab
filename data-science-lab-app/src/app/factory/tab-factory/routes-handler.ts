export class RoutesHandler {
    public index: number;
    constructor(public routes: any[]) {
        this.index = 0;
    }
    invalidRoute(): Error {
        return new Error(`Unable to create tab with route: ${JSON.stringify(this.routes)}`);
    }
    get(offset: number): any {
        if (this.index + offset < this.routes.length) {
            return this.routes[this.index + offset];
        }
        throw this.invalidRoute();
    }
    has(offset: number): boolean {
        return this.index + offset < this.routes.length;
    }
    skip(amount: number): RoutesHandler {
        this.index += amount;
        return this;
    }
    isNumber(offset: number = 0) {
        if (this.index + offset < this.routes.length) {
            return !isNaN(this.routes[offset + this.index]);
        }
        throw this.invalidRoute();
    }
    done(): boolean {
        return (this.index >= this.routes.length);
    }
}
