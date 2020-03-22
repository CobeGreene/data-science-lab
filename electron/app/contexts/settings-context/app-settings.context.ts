import { SettingsContext } from './settings.context';
const settings = require('electron-settings');

export class AppSettingsContext implements SettingsContext {

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
