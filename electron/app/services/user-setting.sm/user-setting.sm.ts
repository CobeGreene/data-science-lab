import { ServiceModel } from '../service-model';
import { ServiceModelRoutes, Producer } from '../../pipeline';
import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { SettingEvents } from '../../../../shared/events';
import { UserSettingDataService } from '../../data-services/user-setting-data-service';
import { Setting } from '../../../../shared/models';

export class UserSettingServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.UserSettingServiceModel,
        routes: [
            { path: SettingEvents.All, method: 'all' },
            { path: SettingEvents.Update, method: 'update' },
        ]
    };

    private dataService: UserSettingDataService;

    constructor(serviceContainer: ServiceContainer, protected producer: Producer) {
        super(serviceContainer, producer);
        this.dataService = serviceContainer.resolve<UserSettingDataService>(SERVICE_TYPES.UserSettingDataService);
    }

    all() {
        this.producer.send(SettingEvents.All, this.dataService.all());
    }

    update(setting: Setting) {
        this.dataService.update(setting);
        this.producer.send(SettingEvents.Update, setting);
    }
}

