import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { ThemeDataService } from './theme.data-service';
import { SettingsContext } from '../../contexts/settings-context';
import * as fs from 'fs';
import { ThemeEvents } from '../../../../shared/events';
import { SystemError, ErrorTypes } from '../../../../shared/errors';

export class AppThemeDataService extends Service implements ThemeDataService {

    private readonly key = 'color-theme';
    private watcher: fs.FSWatcher;

    get producer(): Producer {
        return this.serviceContainer.resolve<Producer>(SERVICE_TYPES.Producer);
    }

    get context(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);
    }

    configure() {
        const path = this.context.get<string>(this.key);
        if (fs.existsSync(path)) {
            this.watcher = fs.watch(path, (event, current) => {
                this.producer.send(ThemeEvents.Change);
            });
        }
    }

    current() {
        const path = this.context.get<string>(this.key);
        if (fs.existsSync(path)) {
            const file = fs.readFileSync(path);
            try {
                const json = JSON.parse(`${file}`);
                return json;
            } catch (error) {
                throw this.parseError(error, path);
            }
        } else {
            throw this.notFound(path);
        }
    }

    parseError(error: SyntaxError, path: string): SystemError {
        return {
            header: 'Color Theme Error',
            description: `File: ${path}, Error: ${error.message} Will use default theme instead.`,
            type: ErrorTypes.Warning
        };
    }

    notFound(path: string): SystemError {
        return {
            header: 'Color Theme Error',
            description: `Couldn't find color theme '${path}'. Will use default theme instead.`,
            type: ErrorTypes.Warning
        };
    }


}
