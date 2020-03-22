import { ServiceModel } from '../service-model';
import { ServiceModelRoutes, Producer } from '../../pipeline';
import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { OpenLinkEvent } from '../../../../shared/events';
import { shell } from 'electron';


export class OpenLinkServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.OpenLinkServiceModel,
        routes: [
            { path: OpenLinkEvent, method: 'open' }
        ]
    };

    constructor(serviceContainer: ServiceContainer, protected producer: Producer) {
        super(serviceContainer, producer);
    }

    open(href: string) {
        shell.openExternalSync(href);
    }
}

