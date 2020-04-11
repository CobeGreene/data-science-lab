import { AppThemeDataService } from './app-theme.data-service';
import { Producer } from '../../pipeline';
import { SettingsContext } from '../../contexts/settings-context';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import * as fs from 'fs';
import * as path from 'path';
import { ThemeEvents } from '../../../../shared/events';
import { UserSettingDataService } from '../user-setting-data-service';

describe('Electron App Theme Data Service', () => {
    let dataService: AppThemeDataService;
    let serviceContainer: ServiceContainer;
    let producer: Producer;
    let context: SettingsContext;
    let user: UserSettingDataService;
    const json = { value: 'value' };
    const jsonPath = path.join(__dirname, 'app-theme-data-service.json');
    const folder = __dirname;

    beforeEach(() => {
        fs.writeFileSync(jsonPath, `${JSON.stringify(json)}`);
        producer = jasmine.createSpyObj('Producer', ['send']);
        
        context = jasmine.createSpyObj('SettingsContext', ['get']);
        (context.get as jasmine.Spy).and.returnValue(folder);

        user = jasmine.createSpyObj('UserSettingDataService', ['find', 'update']);
        (user.find as jasmine.Spy).and.callFake(() => {
            return {
                value: 'app-theme-data-service'
            }
        });

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.Producer) {
                return producer;
            } else if (type === SERVICE_TYPES.SettingsContext) {
                return context;
            } else if (type === SERVICE_TYPES.UserSettingDataService) {
                return user;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });
        dataService = new AppThemeDataService(serviceContainer);
        dataService.configure();
    });

    it('should set choices', () => {
        expect(user.update).toHaveBeenCalledWith({
            value: 'app-theme-data-service',
            choices: [
                'app-theme-data-service'
            ]
        })
    });

    it('should get current theme', () => {
        const actual = dataService.current();
        expect(actual.value).toBe('value');
    });

    it('should switch to current theme', () => {
        const actual = dataService.switch('app-theme-data-service');
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

    it('should throw error for switch value not found', () => {
        expect(() => {
            dataService.switch('404');
        }).toThrow();
    });

});



