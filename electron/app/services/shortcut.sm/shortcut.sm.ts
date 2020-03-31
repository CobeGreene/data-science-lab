import { ServiceModel } from '../service-model';
import { ServiceModelRoutes, Producer } from '../../pipeline';
import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { ShortcutEvents } from '../../../../shared/events';
import { ShortcutDataService } from '../../data-services/shortcut-data-service';
import { Shortcut } from '../../../../shared/models';

export class ShortcutServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.ShortcutServiceModel,
        routes: [
            { path: ShortcutEvents.All, method: 'all' },
            { path: ShortcutEvents.Update, method: 'update' },
        ]
    };

    private dataService: ShortcutDataService;

    constructor(serviceContainer: ServiceContainer, protected producer: Producer) {
        super(serviceContainer, producer);
        this.dataService = serviceContainer.resolve<ShortcutDataService>(SERVICE_TYPES.ShortcutDataService);
    }

    all() {
        this.producer.send(ShortcutEvents.All, this.dataService.all());
    }

    update(shortcut: Shortcut) {
        this.dataService.update(shortcut);
        this.producer.send(ShortcutEvents.All, this.dataService.all());
    }
}



