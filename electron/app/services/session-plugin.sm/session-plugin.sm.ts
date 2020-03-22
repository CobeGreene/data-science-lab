import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { ServiceModelRoutes, Producer, } from '../../pipeline';
import { PackageEvents, ErrorEvent } from '../../../../shared/events';
import { ServiceModel } from '../service-model';
import { Package } from '../../../../shared/models';
import { SessionPluginDataService } from '../../data-services/session-plugin-data-service';


export class SessionPluginServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.SessionPluginServiceModel,
        routes: [
            { path: PackageEvents.SessionAll, method: 'all' },
            { path: PackageEvents.Install, method: 'install', isListener: true },
            { path: PackageEvents.Uninstall, method: 'uninstall', isListener: true }
        ]
    };

    private dataService: SessionPluginDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);
        this.dataService = serviceContainer.resolve<SessionPluginDataService>(SERVICE_TYPES.SessionPluginDataService);
    }

    all() {
        this.producer.send(PackageEvents.SessionAll, this.dataService.all());
    }
    
    async install(pluginPackage: Package) {
        await this.dataService.install(pluginPackage);
        this.producer.send(PackageEvents.SessionAll, this.dataService.all());
    }

    async uninstall(pluginPackage: Package) {
        await this.dataService.uninstall(pluginPackage);
        this.producer.send(PackageEvents.SessionAll, this.dataService.all());
    }



}
