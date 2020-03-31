import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { ShortcutDataService } from '../../data-services/shortcut-data-service';
import { Producer } from '../../pipeline';
import { ShortcutServiceModel } from './shortcut.sm';

describe('Electron Shortcut Service Model', () => {
    let serviceModel: ShortcutServiceModel;
    let serviceContainer: ServiceContainer;
    let dataService: ShortcutDataService;
    let producer: Producer;

    beforeAll(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.ShortcutDataService) {
                return dataService;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });
    });

    beforeEach(() => {
        producer = jasmine.createSpyObj('Producer', ['send']);
        dataService = jasmine.createSpyObj('ShortcutDataService', ['all', 'update']);
        serviceModel = new ShortcutServiceModel(serviceContainer, producer);
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
            label: 'title',
        });

        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(dataService.update).toHaveBeenCalledTimes(1);
        expect(dataService.all).toHaveBeenCalledTimes(1);

    });


});


