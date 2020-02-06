import { SettingsDataService } from './settings.data-service';
import { ApiSettings, DataGroupSettings } from '../../models';

export class MockSettingsDataService implements SettingsDataService {

    readApiSettings: () => ApiSettings;
    readPluginPath: () => string;
    readDataGroupSettings: () => DataGroupSettings;
    readExperimentsFolder: () => string;

    constructor() {
        this.reset();
    }

    reset() {
        this.readApiSettings = () => {
            return new ApiSettings();
        };
        this.readPluginPath = () => '';
        this.readDataGroupSettings = () => {
            return new DataGroupSettings();
        };
        this.readExperimentsFolder = () => '';
    }




}

