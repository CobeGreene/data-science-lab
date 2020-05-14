import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { UserSettingDataService } from './user-setting.data-service';
import { SettingsContext } from '../../contexts/settings-context';
import * as fs from 'fs';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import { Setting } from '../../../../shared/models';

export class AppUserSettingDataService extends Service implements UserSettingDataService {

    private readonly key = 'user-setting';

    get context(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);
    }

    all() {
        const path = this.context.get<string>(this.key);
        if (fs.existsSync(path)) {
            const file = fs.readFileSync(path);
            try {
                const json = JSON.parse(`${file}`);
                return json as Setting[];
            } catch (error) {
                throw this.parseError(error, path);
            }
        } else {
            throw this.notFound(path);
        }
    }

    find(key: string): Setting {
        return this.all().find(value => value.key === key);
    }

    update(setting: Setting) {
        const settings = this.all();
        const index = settings.findIndex((value) => value.key === setting.key);
        if (index >= 0) {
            settings.splice(index, 1, setting);
            const path = this.context.get<string>(this.key);
            fs.writeFileSync(path, JSON.stringify(settings));
        } else {
            throw this.missingSetting(setting);
        }
    }

    parseError(error: SyntaxError, path: string): SystemError {
        return {
            header: 'Setting Error',
            description: `File: ${path}, Error: ${error.message} Will use default settings instead.`,
            type: ErrorTypes.Warning
        };
    }

    missingSetting(setting: Setting): SystemError {
        return {
            header: 'Setting Error',
            description: `Unable to find ${setting.key} - ${setting.title}`,
            type: ErrorTypes.Error
        };
    }

    notFound(path: string): SystemError {
        return {
            header: 'Setting Error',
            description: `Couldn't find setting '${path}'. Will use default theme instead.`,
            type: ErrorTypes.Warning
        };
    }

}



