import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { ShortcutDataService } from './shortcut.data-service';
import { SettingsContext } from '../../contexts/settings-context';
import * as fs from 'fs';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import { Shortcut } from '../../../../shared/models';

export class AppShortcutDataService extends Service implements ShortcutDataService {

    private readonly key = 'shortcut';

    get context(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);
    }

    all(): Shortcut[] {
        const path = this.context.get<string>(this.key);
        if (fs.existsSync(path)) {
            const file = fs.readFileSync(path);
            try {
                const json = JSON.parse(`${file}`);
                return json as Shortcut[];
            } catch (error) {
                throw this.parseError(error, path);
            }
        } else {
            throw this.notFound(path);
        }
    }

    find(key: string): Shortcut {
        return this.all().find(value => value.key === key);
    }

    update(shortcut: Shortcut) {
        const shortcuts = this.all();
        const index = shortcuts.findIndex((value) => value.key === shortcut.key);
        if (index >= 0) {
            shortcuts.splice(index, 1, shortcut);
            const path = this.context.get<string>(this.key);
            fs.writeFileSync(path, JSON.stringify(shortcuts));
        } else {
            throw this.missingShortcut(shortcut);
        }
    }

    parseError(error: SyntaxError, path: string): SystemError {
        return {
            header: 'Shortcut Error',
            description: `File: ${path}, Error: ${error.message}`,
            type: ErrorTypes.Warning
        };
    }

    missingShortcut(shortcut: Shortcut): SystemError {
        return {
            header: 'Shortct Error',
            description: `Unable to find ${shortcut.key} - ${shortcut.label}`,
            type: ErrorTypes.Error
        };
    }

    notFound(path: string): SystemError {
        return {
            header: 'Shortcut Error',
            description: `Couldn't find shortcuts '${path}'.`,
            type: ErrorTypes.Warning
        };
    }
}