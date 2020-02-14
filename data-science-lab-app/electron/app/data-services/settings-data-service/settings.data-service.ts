import { ApiSettings, DataGroupSettings } from '../../models';

export interface SettingsDataService {

    readApiSettings(): ApiSettings;
    readPluginPath(): string;
    readDataGroupSettings(): DataGroupSettings;
    readExperimentsFolder(): string;
}
