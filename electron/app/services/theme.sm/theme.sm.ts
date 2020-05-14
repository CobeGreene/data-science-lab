import { SERVICE_TYPES, ServiceContainer, Service } from '../../service-container';
import { ServiceModelRoutes, Producer,  } from '../../pipeline';
import { ThemeEvents, SettingEvents } from '../../../../shared/events';
import { ServiceModel  } from '../service-model';
import { ThemeDataService } from '../../data-services/theme-data-service';
import { Setting } from '../../../../shared/models';
import { Settings } from '../../../../shared/settings';

export class ThemeServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.ThemeServiceModel,
        routes: [
            { path: ThemeEvents.Current, method: 'current' },
            { path: SettingEvents.Update, method: 'update' }
        ]
    };

    private dataService: ThemeDataService;

    constructor(serviceContainer: ServiceContainer, protected producer: Producer) {
        super(serviceContainer, producer);
        this.dataService = serviceContainer.resolve<ThemeDataService>(SERVICE_TYPES.ThemeDataService);
    }

    current() {
        this.producer.send(ThemeEvents.Current, this.dataService.current());
    }

    update(setting: Setting) {
        if (setting.key === Settings.ColorTheme) {
            this.producer.send(ThemeEvents.Current, this.dataService.switch(setting.value));
        }
    }
}


