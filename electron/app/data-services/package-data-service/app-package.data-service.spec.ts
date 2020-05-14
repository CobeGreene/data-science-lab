import { AppPackageDataService } from './app-package.data-service';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { SettingsContext } from '../../contexts/settings-context';
import { Package } from '../../../../shared/models';
import { PluginContext } from '../../contexts/plugin-context';
import { Producer } from '../../pipeline';


describe('Electron App Package Data Service', () => {
    let dataService: AppPackageDataService;
    let serviceContainer: ServiceContainer;
    let settings: SettingsContext;
    let context: PluginContext;
    let producer: Producer;
    let packages: Package[];

    beforeEach(() => {
        packages = [
            {
                install: true,
                name: 'Unique',
                owner: 'Owner',
                plugins: [
                    {
                        packageName: 'Unique',
                        className: 'Class',
                        description: 'Desc',
                        name: 'Plugin',
                        type: 'Fetch'
                    }
                ],
                repositoryName: 'Repo',
                username: 'User',
            }
        ];

        settings = jasmine.createSpyObj('SettingsContext', ['get', 'set']);
        (settings.get as jasmine.Spy).and.callFake((value: string) => {
            if (value === 'packages') {
                return packages;
            } else {
                throw new Error(`Invalid key for settings ${value}`);
            }
        });

        producer = jasmine.createSpyObj('Producer', ['send']);
        context = jasmine.createSpyObj('PluginContext', ['install', 'uninstall']);

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SettingsContext) {
                return settings;
            } else if (type === SERVICE_TYPES.Producer) {
                return producer;
            } else if (type === SERVICE_TYPES.PluginContext) {
                return context;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });

        dataService = new AppPackageDataService(serviceContainer);
        dataService.configure();
    });

    it('read should get package from settings', () => {
        const pluginPackage = dataService.read('Unique');

        expect(pluginPackage.repositoryName).toBe('Repo');
    });

    it('find should get package from settings', () => {
        const pluginPackage = dataService.find(packages[0].plugins[0]);

        expect(pluginPackage.repositoryName).toBe('Repo');
    });

    it('find should return undefined for not found', () => {
        expect(dataService.find({
            name: 'Plugin',
            className: 'Class',
            description: 'Desc',
            type: 'Type',
            packageName: 'Not Found'
        })).toBe(undefined);
    });

    it('has should return true for Unique', () => {
        expect(dataService.has('Unique')).toBeTruthy();
    });

    it('has should return false for Not Found', () => {
        expect(dataService.has('Not Found')).toBeFalsy();
    });

    it('unstall should throw for not found', async (done) => {
        try {
            await dataService.uninstall({
                name: 'Not Found',
                owner: 'Owner',
                plugins: [],
                repositoryName: 'Repo',
                username: 'User',
                install: true,
            });
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('uninstall should call context and splice it from packages', async () => {
        await dataService.uninstall(packages[0]);

        expect(dataService.all().length).toBe(0);
        expect(context.uninstall).toHaveBeenCalledTimes(1);
    });

    it('uninstall should save to settings', async () => {
        await dataService.uninstall(packages[0]);
        expect(settings.set).toHaveBeenCalledTimes(1);
        expect(settings.set).toHaveBeenCalledWith('packages', []);
    });

    it('install should throw for already install', async (done) => {
        try {
            await dataService.install(packages[0]);
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('install should add package and call context', async () => {
        await dataService.install({
            name: 'New Package',
            install: false,
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'Username'
        });
        expect(dataService.all().length).toBe(2);
        expect(context.install).toHaveBeenCalledTimes(1);
    });

    it('install should call save', async () => {
        const newPackage = {
            name: 'New Package',
            install: true,
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'Username'
        }
        await dataService.install(newPackage);
        expect(settings.set).toHaveBeenCalledTimes(1);
        expect(settings.set).toHaveBeenCalledWith('packages', [packages[0], newPackage]);
    });

});


