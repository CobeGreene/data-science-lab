import { AppThemeDataService } from './app-theme.data-service';
import { Producer } from '../../pipeline';
import { SettingsContext } from '../../contexts/settings-context';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import * as fs from 'fs';
import * as path from 'path';
import { ThemeEvents } from '../../../../shared/events';

describe('Electron App Theme Data Service', () => {
    let dataService: AppThemeDataService;
    let serviceContainer: ServiceContainer;
    let producer: Producer;
    let context: SettingsContext;
    const json = { value: 'value' };
    const jsonPath = path.join(__dirname, 'app-theme-data-service.json');
    
    beforeEach(() => {
        fs.writeFileSync(jsonPath, `${JSON.stringify(json)}`);
        producer = jasmine.createSpyObj('Producer', ['send']);
        
        context = jasmine.createSpyObj('SettingsContext', ['get']);
        (context.get as jasmine.Spy).and.returnValue(jsonPath);

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.Producer) {
                return producer;
            } else if (type === SERVICE_TYPES.SettingsContext) {
                return context;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });
        dataService = new AppThemeDataService(serviceContainer);
        dataService.configure();
    });

    it('should get current theme', () => {
        const actual = dataService.current();
        expect(actual.value).toBe('value');
    });

    it('should send change event when file is save to', (done) => {
        (producer.send as jasmine.Spy).and.callFake((event) => {
            expect(event).toEqual(ThemeEvents.Change);
            done();
        });
        fs.appendFileSync(jsonPath, ' ');
    });

    it('should throw error for changing the file to have json error', () => {
        fs.appendFileSync(jsonPath, '}');
        expect(() => {
            dataService.current();
        }).toThrow();
    });

    it('should throw error for file not found', () => {
        fs.unlinkSync(jsonPath);
        expect(() => {
            dataService.current();
        }).toThrow();
    });

});



