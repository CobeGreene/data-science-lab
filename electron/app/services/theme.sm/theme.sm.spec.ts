import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { ThemeDataService } from '../../data-services/theme-data-service';
import { Producer } from '../../pipeline';
import { ThemeServiceModel } from './theme.sm';
import { ThemeEvents } from '../../../../shared/events';
import { Settings } from '../../../../shared/settings';


describe('Electron Theme Service Model', () => {
    let serviceModel: ThemeServiceModel;
    let serviceContainer: ServiceContainer;
    let dataService: ThemeDataService;
    let producer: Producer;

    
    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.ThemeDataService) {
                return dataService;
            } 
            throw new Error(`Couldn't resolve type ${type}.`);
        });
        producer = jasmine.createSpyObj('Producer', ['send']);
        dataService = jasmine.createSpyObj('ThemeDataService', ['current', 'switch']);
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

    it('update should set value in data service', () => {
        (dataService.switch as jasmine.Spy).and.returnValue({});
        serviceModel.update({
            key: Settings.ColorTheme,
            default: '',
            value: 'value',
            description: '',
            title: '',
        });
        expect(dataService.switch).toHaveBeenCalledTimes(1);
        expect(dataService.switch).toHaveBeenCalledWith('value');
        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(ThemeEvents.Current, {});
    });
    
    it('update should do nothing', () => {
        (dataService.switch as jasmine.Spy).and.returnValue({});
        serviceModel.update({
            key: 'nothing',
            default: '',
            value: 'value',
            description: '',
            title: '',
        });
        expect(dataService.switch).toHaveBeenCalledTimes(0);
        expect(producer.send).toHaveBeenCalledTimes(0);
    });


});
