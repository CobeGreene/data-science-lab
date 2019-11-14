export interface DocumentContext {
    set(collection: string, value: any): void;
    get<T>(path: string, defaultValue?: T): T;
    has(path: string): boolean;
}
