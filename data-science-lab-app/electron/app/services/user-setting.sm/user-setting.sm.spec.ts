import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { UserSettingDataService } from '../../data-services/user-setting-data-service';
import { Producer } from '../../pipeline';
import { UserSettingServiceModel } from './user-setting.sm';
import { SettingEvents } from '../../../../shared/events';


describe('Electron User Setting Service Model', () => {
    let serviceModel: UserSettingServiceModel;
    let serviceContainer: ServiceContainer;
    let dataService: UserSettingDataService;
    let producer: Producer;

    beforeAll(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.UserSettingDataService) {
                return dataService;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });
    });

    beforeEach(() => {
        producer = jasmine.createSpyObj('Producer', ['send']);
        dataService = jasmine.createSpyObj('UserSettingDataService', ['all', 'update']);
        serviceModel = new UserSettingServiceModel(serviceContainer, producer);
    });

    it('all should call producer and data service', () => {
        (dataService.all as jasmine.Spy).and.returnValue([]);


        serviceModel.all();
        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(dataService.all).toHaveBeenCalledTimes(1);
    });

    it('update should call producer and data service', () => {
        (dataService.update as jasmine.Spy).and.returnValue(0);

        serviceModel.update({
            key: 'key',
            value: 'value',
            default: 'value',
            description: 'desc',
            title: 'title',
        });

        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(dataService.update).toHaveBeenCalledTimes(1);

    });


});


