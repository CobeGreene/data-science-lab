export class IdGenerator {
    constructor(private start: number = 1) {

    }
    
    next(): number {
        return this.start++;
    }

    at(): number {
        return this.start;
    }
}
