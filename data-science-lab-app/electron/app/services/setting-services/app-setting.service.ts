import { SettingService } from './setting.service';
const settings = require('electron-settings');

export class AppSettingService implements SettingService {

    constructor(path?: string) {
        if (path != null) {
            settings.setPath(path);
        }
    }

    set(path: string, value: any): void {
        settings.set(path, value);
    }

    get<T>(path: string, defaultValue?: T): T {
        return this.get(path, defaultValue);
    }

    has(path: string): boolean {
        return settings.has(path);
    }
}
