import { SettingsDataService } from './settings.data-service';
import { ApiSettings, DataGroupSettings } from '../../models';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { DocumentContext } from '../../contexts';
import { isContext } from 'vm';

export class AppSettingsDataService implements SettingsDataService {
    
    readonly API_SETTINGS = 'api-settings';
    readonly PLUGINS_PACKAGE = 'plugins-package';
    readonly DATA_GROUP_SETTINGS = 'data-group-settings';

    constructor(private serviceContainer: ServiceContainer) {
    }
    
    readApiSettings(): ApiSettings {
        const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
        return context.get<ApiSettings>(this.API_SETTINGS);
    }

    readPluginPath(): string {
        const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
        return context.get<string>(this.PLUGINS_PACKAGE);
    }

    readDataGroupSettings(): DataGroupSettings {
        const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
        return context.get<DataGroupSettings>(this.DATA_GROUP_SETTINGS);
    }
}
