import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { ThemeDataService } from './theme.data-service';
import { SettingsContext } from '../../contexts/settings-context';
import * as fs from 'fs';
import { ThemeEvents } from '../../../../shared/events';

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
        this.watcher = fs.watch(this.context.get<string>(this.key), (event, current) => {
            this.producer.send(ThemeEvents.Change);
        });       
    }

    current() {
        const path = this.context.get<string>(this.key);
        const file = fs.readFileSync(path);
        const json = JSON.parse(`${file}`);
        return json;
    }


}
