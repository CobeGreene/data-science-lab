import { ApiSettings } from '../../models';

export interface SettingsDataService {

    readApiSettings(): ApiSettings;
    readPluginPath(): string;
}
