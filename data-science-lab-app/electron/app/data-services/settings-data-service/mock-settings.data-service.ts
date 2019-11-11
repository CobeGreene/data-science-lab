import { SettingsDataService } from './settings.data-service';
import { ApiSettings } from '../../models';

export class MockSettingsDataService implements SettingsDataService {

    readApiSettings: () => ApiSettings;
    readPluginPath: () => string;

    constructor() {
        this.reset();
    }

    reset() {
        this.readApiSettings = () => {
            return new ApiSettings();
        };
        this.readPluginPath = () => '';
    }




}

