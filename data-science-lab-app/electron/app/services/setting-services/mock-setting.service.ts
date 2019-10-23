import { SettingService } from './setting.service';

export class MockSettingService implements SettingService {
    
    private settings: any;

    constructor() {
        this.settings = new Object();
    }

    set(path: string, value: any): void {
        this.settings[path] = value;
    }
    
    get<T>(path: string, defaultValue?: T): T {
        if (this.has(path)) {
            return this.settings[path];
        }
        if (defaultValue == null) {
            throw new Error(`path was not found for ${path}.`);
        }
        this.settings[path] = defaultValue;
        return this.settings[path] as T;
    }
    
    has(path: string): boolean {
        return this.settings[path] != null;
    }


}
