import { DataGroupsService } from './data-groups.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { ExperimentDataGroupDataService, SettingsDataService } from '../../data-services';
import { DataGroupsProducers } from '../../producers/data-groups-producer';



export class AppDataGroupsService implements DataGroupsService {

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): void {
        const dataGroupsDataService = 
            this.serviceContainer
            .resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);
        const dataGroups = dataGroupsDataService.all();
        const producer = this.serviceContainer.resolve<DataGroupsProducers>(SERVICE_TYPES.DataGroupsProducer);
        
        const settingsDataService = this.serviceContainer.resolve<SettingsDataService>(SERVICE_TYPES.SettingsDataService);
        const settings = settingsDataService.readDataGroupSettings(); 
        producer.all(dataGroups, settings);
    }

    delete(id: number) {
        const dataGroupsDataService = 
        this.serviceContainer
        .resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);

        dataGroupsDataService.delete(id);
        const producer = this.serviceContainer.resolve<DataGroupsProducers>(SERVICE_TYPES.DataGroupsProducer);
        producer.delete(id);
    }
}
