import { AppDataGroupsService } from './app-data-groups.service';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockExperimentDataGroupDataService } from '../../data-services';
import { MockDataGroupsProducer } from '../../producers/data-groups-producer';
import { MockSettingsDataService } from '../../data-services/settings-data-service';


describe('Electron App Data Groups Service Tests', () => {

    let dataGroupsService: AppDataGroupsService;
    let serviceContainer: MockServiceContainer;
    let dataService: MockExperimentDataGroupDataService;
    let producer: MockDataGroupsProducer;
    let settingsDataService: MockSettingsDataService;

    beforeEach(() => {
        serviceContainer = new MockServiceContainer();
        dataService = new MockExperimentDataGroupDataService();
        producer = new MockDataGroupsProducer();
        settingsDataService = new MockSettingsDataService();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.ExperimentDataGroupDataService:
                    return dataService;
                case SERVICE_TYPES.DataGroupsProducer:
                    return producer;
                case SERVICE_TYPES.SettingsDataService:
                    return settingsDataService;
                default:
                    throw new Error(`Not implemented error.`);
            }
        };
        dataGroupsService = new AppDataGroupsService(serviceContainer);
    });

    it('all should call all on producer', (done) => {
        dataService.all = () => {
            return [];
        };
        producer.all = () => {
            expect().nothing();
            done();
        };
        dataGroupsService.all();
    });

    it('delete should call delete on producer', (done) => {
        producer.delete = (id) => {
            expect(id).toBe(1);
            done();
        };
        dataGroupsService.delete(1);
    });

});

