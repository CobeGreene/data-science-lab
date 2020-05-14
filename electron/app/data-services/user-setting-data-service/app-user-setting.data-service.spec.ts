import { AppUserSettingDataService } from './app-user-setting.data-service';
import { SettingsContext } from '../../contexts/settings-context';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import * as fs from 'fs';
import * as path from 'path';
import { Setting } from '../../../../shared/models';


describe('Electron App User Setting Data Service', () => {
    let dataService: AppUserSettingDataService;
    let serviceContainer: ServiceContainer;
    let context: SettingsContext;
    const json: Setting[] = [
        {
            key: 'key',
            value: 'value',
            default: 'value',
            description: 'My description',
            title: 'Title'
        },
        {
            key: 'key2',
            value: 'value2',
            default: 'value2',
            description: 'My description2',
            title: 'Title2'
        },
    ];
    const jsonPath = path.join(__dirname, 'app-user-setting-data-service.json');

    beforeEach(() => {
        fs.writeFileSync(jsonPath, `${JSON.stringify(json)}`);
        context = jasmine.createSpyObj('SettingsContext', ['get']);
        (context.get as jasmine.Spy).and.returnValue(jsonPath);

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SettingsContext) {
                return context;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });

        dataService = new AppUserSettingDataService(serviceContainer);
    });

    it('all should get settings', () => {
        const settings = dataService.all();
        expect(settings.length).toBe(2);
    });

    it('all should throw error for file not found', () => {
        fs.unlinkSync(jsonPath);
        expect(() => {
            dataService.all();
        }).toThrow();
    });

    it('all should throw error for changing the file to have json error', () => {
        fs.appendFileSync(jsonPath, '}');
        expect(() => {
            dataService.all();
        }).toThrow();
    });
    
    it('find should throw error for changing the file to have json error', () => {
        fs.appendFileSync(jsonPath, '}');
        expect(() => {
            dataService.find('404');
        }).toThrow();
    });

    
    it('update should throw error for file not found', () => {
        fs.unlinkSync(jsonPath);
        expect(() => {
            dataService.update({
                key: 'key',
                value: 'value',
                default: 'value',
                description: 'My description',
                title: 'Title'
            });
        }).toThrow();
    });

    it('update should throw error for changing the file to have json error', () => {
        fs.appendFileSync(jsonPath, '}');
        expect(() => {
            dataService.update({
                key: 'key',
                value: 'value',
                default: 'value',
                description: 'My description',
                title: 'Title'
            });
        }).toThrow();
    });

    it('find should get setting with key', () => {
        const setting = dataService.find('key');

        expect(setting.value).toBe('value');
    });

    it('find should return undefined for not found', () => {
        const setting = dataService.find('404');

        expect(setting).toBe(undefined);
    });

    it('update should change setting', () => {
        dataService.update({
            key: 'key',
            value: 'new value',
            default: 'value',
            description: 'My description',
            title: 'Title'
        });

        const setting = dataService.find('key');

        expect(setting.value).toBe('new value');
    });




});

