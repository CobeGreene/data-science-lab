import { DocumentContext } from './document.context';

export class MockDocumentContext implements DocumentContext {

    private documents: any;

    constructor() {
        this.documents = new Object();
    }

    set(path: string, value: any): void {
        this.documents[path] = value;
    }
    
    get<T>(path: string, defaultValue?: T): T {
        if (this.has(path)) {
            return this.documents[path];
        }
        if (typeof defaultValue === 'undefined') {
            throw new Error(`path was not found for ${path}.`);
        }
        this.documents[path] = defaultValue;
        return this.documents[path] as T;
    }
    
    has(path: string): boolean {
        return this.documents[path] != null;
    }

    reset() {
        this.documents = new Object();
    }

}
