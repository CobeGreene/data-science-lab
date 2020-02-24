import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { ServiceModelRoutes, Producer, } from '../../pipeline';
import { PackageEvents, ErrorEvent } from '../../../../shared/events';
import { ServiceModel } from '../service-model';
import { PackageDataService } from '../../data-services/package-data-service';
import { Package } from '../../../../shared/models';



export class PackageServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.PackageServiceModel,
        routes: [
            { path: PackageEvents.All, method: 'all' },
            { path: PackageEvents.Install, method: 'install' },
            { path: PackageEvents.Uninstall, method: 'uninstall' }
        ]
    };

    private dataService: PackageDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);
        this.dataService = serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
    }

    all() {
        this.producer.send(PackageEvents.All, this.dataService.all());
    }

    install(pluginPackage: Package) {
        this.dataService.install(pluginPackage)
            .then(() => {
                this.producer.send(PackageEvents.All, this.dataService.all());
            }).catch((value) => {
                this.producer.send(ErrorEvent, value);
            });
    }

    uninstall(pluginPackage: Package) {
        this.dataService.uninstall(pluginPackage)
            .then(() => {
                this.producer.send(PackageEvents.All, this.dataService.all());
            }).catch((value) => {
                this.producer.send(ErrorEvent, value);
            });
    }
}

