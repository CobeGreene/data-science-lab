import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { ThemeDataService } from './theme.data-service';
import { SettingsContext } from '../../contexts/settings-context';
import * as fs from 'fs';
import * as path from 'path';
import { ThemeEvents } from '../../../../shared/events';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import { UserSettingDataService } from '../user-setting-data-service';
import { Settings } from '../../../../shared/settings';

export class AppThemeDataService extends Service implements ThemeDataService {

    private readonly folder = 'color-themes';
    private watcher: fs.FSWatcher;
    private watching: boolean;

    get producer(): Producer {
        return this.serviceContainer.resolve<Producer>(SERVICE_TYPES.Producer);
    }

    get context(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    get user(): UserSettingDataService {
        return this.serviceContainer.resolve<UserSettingDataService>(SERVICE_TYPES.UserSettingDataService);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);
    }

    configure() {
        const folder = this.context.get<string>(this.folder);
        const setting = this.user.find(Settings.ColorTheme);
        setting.choices = fs.readdirSync(folder)
            .filter((value) => value.endsWith('.json') && value.length > 6)
            .map(value => value.substring(0, value.length - 5));
        const choice = setting.value;
        this.user.update(setting);
        this.switch(choice);
    }

    current() {
        const setting = this.user.find(Settings.ColorTheme);
        const folder = this.context.get<string>(this.folder);
        const themePath = path.join(folder, `${setting.value}.json`);
        if (fs.existsSync(themePath)) {
            const file = fs.readFileSync(themePath);
            try {
                const json = JSON.parse(`${file}`);
                return json;
            } catch (error) {
                throw this.parseError(error, themePath);
            }
        } else {
            throw this.notFound(themePath);
        }
    }

    switch(value: string) {
        const folder = this.context.get<string>(this.folder);
        const themePath = path.join(folder, `${value}.json`);
        if (fs.existsSync(themePath)) {
            const file = fs.readFileSync(themePath);
            try {
                const json = JSON.parse(`${file}`);
                this.watch(themePath);
                return json;
            } catch (error) {
                throw this.parseError(error, themePath);
            }
        } else {
            throw this.notFound(themePath);
        }
    }

    watch(path: string) {
        if (this.watcher !== undefined) {
            this.watcher.removeAllListeners();
        }
        if (fs.existsSync(path)) {
            this.watcher = fs.watch(path, (event, current) => {
                if (this.watching) {
                    return;
                }
                this.watching = true;
                setTimeout(() => {
                    this.watching = false;
                }, 100);
                this.producer.send(ThemeEvents.Change);
            });
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
