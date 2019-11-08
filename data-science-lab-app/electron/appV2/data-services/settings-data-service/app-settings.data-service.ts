import { SettingsDataService } from './settings.data-service';
import { ApiSettings } from '../../models';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { DocumentContext } from '../../contexts';

export class AppSettingsDataService implements SettingsDataService {
    
    readonly API_SETTINGS = 'api-settings';

    constructor(private serviceContainer: ServiceContainer) {
    }
    
    readApiSettings(): ApiSettings {
        const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
        return context.get<ApiSettings>(this.API_SETTINGS);
    }

}
