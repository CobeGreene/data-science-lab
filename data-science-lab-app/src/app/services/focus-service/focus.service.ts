import { Subject } from 'rxjs';

export abstract class FocusService {

    focusChanged: Subject<string>;
    
    constructor() {
        this.focusChanged = new Subject<string>();
    }

    abstract current(): string;
    abstract set(focus: string): void;
    abstract pop(): void;
}
