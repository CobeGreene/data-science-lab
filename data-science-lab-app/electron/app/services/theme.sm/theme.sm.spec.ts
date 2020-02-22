import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { ThemeDataService } from '../../data-services/theme-data-service';
import { Producer } from '../../pipeline';
import { ThemeServiceModel } from './theme.sm';
import { ThemeEvents } from '../../../../shared/events';


describe('Electron Theme Service Model', () => {
    let serviceModel: ThemeServiceModel;
    let serviceContainer: ServiceContainer;
    let dataService: ThemeDataService;
    let producer: Producer;

    beforeAll(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.ThemeDataService) {
                return dataService;
            } 
            throw new Error(`Couldn't resolve type ${type}.`);
        });
    });

    beforeEach(() => {
        producer = jasmine.createSpyObj('Producer', ['send']);
        dataService = jasmine.createSpyObj('ThemeDataService', ['current']);
        serviceModel = new ThemeServiceModel(serviceContainer, producer);
    });

    it('current should call producer and data service', () => {
        (dataService.current as jasmine.Spy).and.returnValue(0);
        
        serviceModel.current();
        expect(producer.send).toHaveBeenCalled();
        expect(dataService.current).toHaveBeenCalled();
    });
    
    it('current should give producer the value in data service', (done) => {
        (dataService.current as jasmine.Spy).and.returnValue(0);
        (producer.send as jasmine.Spy).and.callFake((event, arg) => {
            expect(event).toBe(ThemeEvents.Current);
            expect(arg).toBe(0);
            done();
        });
        
        serviceModel.current();
    });


});
