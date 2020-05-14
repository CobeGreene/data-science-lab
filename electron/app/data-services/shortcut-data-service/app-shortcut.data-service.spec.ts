import { AppShortcutDataService } from './app-shortcut.data-service';
import { SettingsContext } from '../../contexts/settings-context';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import * as fs from 'fs';
import * as path from 'path';
import { Shortcut } from '../../../../shared/models';


describe('Electron App User Shortcut Data Service', () => {
    let dataService: AppShortcutDataService;
    let serviceContainer: ServiceContainer;
    let context: SettingsContext;
    const json: Shortcut[] = [
        {
            key: 'key',
            value: 'value',
            default: 'value',
            label: 'Title'
        },
        {
            key: 'key2',
            value: 'value2',
            default: 'value2',
            label: 'Title2'
        },
    ];
    const jsonPath = path.join(__dirname, 'app-user-shortcut-data-service.json');

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

        dataService = new AppShortcutDataService(serviceContainer);
    });

    it('all should get shortcuts', () => {
        const shortcuts = dataService.all();
        expect(shortcuts.length).toBe(2);
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
                label: 'Title'
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
                label: 'Title'
            });
        }).toThrow();
    });

    it('find should get shortcut with key', () => {
        const shortcut = dataService.find('key');

        expect(shortcut.value).toBe('value');
    });

    it('find should return undefined for not found', () => {
        const shortcut = dataService.find('404');

        expect(shortcut).toBe(undefined);
    });

    it('update should change shortcut', () => {
        dataService.update({
            key: 'key',
            value: 'new value',
            default: 'value',
            label: 'Title'
        });

        const shortcut = dataService.find('key');

        expect(shortcut.value).toBe('new value');
    });




});

