import { PackageService } from './package.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { InstalledPackageDataService, AllPackageDataService } from '../../data-services';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';

export class AppPackageService implements PackageService {

    private fetching: boolean;

    constructor(private serviceContainer: ServiceContainer) {
        this.fetching = false;
    }

    all(): void {
        const allDataService = this.serviceContainer.resolve<AllPackageDataService>(SERVICE_TYPES.AllPackageDataService);
        if (!this.fetching) {
            this.fetching = true;
            allDataService.all((pluginPackageList: PluginPackageList) => {

            }, (reason: any) => {

            });
        } 
        allDataService.all();
    }    
    
    install(pluginPackage: PluginPackage): void {
        const installedDataService = this.serviceContainer
            .resolve<InstalledPackageDataService>(SERVICE_TYPES.InstalledPackageDataService);
        
        installedDataService.install(pluginPackage)
            .then((value) => {
                this.all();
            }).catch(() => {

            });
    }
    
    uninstall(pluginPackage: PluginPackage): void {
        const installedDataService = this.serviceContainer
            .resolve<InstalledPackageDataService>(SERVICE_TYPES.InstalledPackageDataService);
        installedDataService.uninstall(pluginPackage.name)
            .then((value) => {
                this.all();
            }).catch(() => {

            });
    }
}
