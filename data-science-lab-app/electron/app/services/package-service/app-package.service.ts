import { PackageService } from './package.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { PackageDataService } from '../../data-services';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { PackageProducer } from '../../producers';

export class AppPackageService implements PackageService {

    constructor(private serviceContainer: ServiceContainer) {
    }

    all(): void {
        const packageDataService = this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        this.produceAll(packageDataService.all(this.produceAll, this.produceError));
    }

    private produceAll = (pluginPackageList: PluginPackageList) => {
        const producer = this.serviceContainer.resolve<PackageProducer>(SERVICE_TYPES.PackageProducer);
        producer.all(pluginPackageList);
    }

    private produceError = (reason: any) => {
        const producer = this.serviceContainer.resolve<PackageProducer>(SERVICE_TYPES.PackageProducer);
        producer.error(reason);
    }

    install(pluginPackage: PluginPackage): void {
        const packageDataService = this.serviceContainer
            .resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        packageDataService.install(pluginPackage)
            .then(() => {
                const producer = this.serviceContainer.resolve<PackageProducer>(SERVICE_TYPES.PackageProducer);
                producer.install(pluginPackage);
                this.all();
            }).catch(this.produceError);
    }

    uninstall(pluginPackage: PluginPackage): void {
        const packageDataService = this.serviceContainer
            .resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        packageDataService.uninstall(pluginPackage.name)
            .then(() => {
                const producer = this.serviceContainer.resolve<PackageProducer>(SERVICE_TYPES.PackageProducer);
                producer.uninstall(pluginPackage);
                this.all();
            }).catch(this.produceError);
    }
}
