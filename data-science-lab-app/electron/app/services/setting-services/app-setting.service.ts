import { SettingService } from './setting.service';
const settings = require('electron-settings');

export class AppSettingService implements SettingService {

    constructor() {
    
    }

    set(path: string, value: any): void {
        settings.set(path, value);
    }

    get<T>(path: string, defaultValue?: T): T {
        return settings.get(path, defaultValue);
    }

    has(path: string): boolean {
        return settings.has(path);
    }
}
