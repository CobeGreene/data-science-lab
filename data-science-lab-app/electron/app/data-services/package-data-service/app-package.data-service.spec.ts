import { AppPackageDataService } from './app-package.data-service';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { SettingsContext } from '../../contexts/settings-context';
import { Plugin, Package } from '../../../../shared/models';
import { PluginContext } from '../../contexts/plugin-context';
import { WebService, Response, Request } from 'data-science-lab-core';
import { Producer } from '../../pipeline';
import { PackageEvents } from '../../../../shared/events';


describe('Electron App Package Data Service', () => {
    let dataService: AppPackageDataService;
    let serviceContainer: ServiceContainer;
    let web: WebService;
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
            if (value === 'api-settings') {
                return {
                    protocol: 'protocol',
                    hostname: 'hostname',
                    port: 300,
                    path: 'path'
                };
            } else if (value === 'packages') {
                return packages;
            } else {
                throw new Error(`Invalid key for settings ${value}`);
            }
        });

        web = jasmine.createSpyObj('WebService', ['send']);
        producer = jasmine.createSpyObj('Producer', ['send']);
        context = jasmine.createSpyObj('PluginContext', ['install', 'uninstall']);

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SettingsContext) {
                return settings;
            } else if (type === SERVICE_TYPES.Producer) {
                return producer;
            } else if (type === SERVICE_TYPES.WebService) {
                return web;
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

    it('all should call web service', (done) => {
        (web.send as jasmine.Spy).and.callFake(async () => {
            return new Response({
                statusCode: 200,
                body: Buffer.from(`${JSON.stringify([])}`)
            });
        });
        (producer.send as jasmine.Spy).and.callFake((event) => {
            expect(event).toBe(PackageEvents.Change);
            done();
        });
        dataService.all();
    });

    it('all should return packages', () => {
        (web.send as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(new Response({
                        statusCode: 200,
                        body: Buffer.from(`${JSON.stringify([])}`)
                    }));
                }, 10);
            });
        });
        expect(dataService.all().length).toBe(packages.length);
    });

    it('all should return package with increase one', (done) => {
        (web.send as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve) => {
                resolve(new Response({
                    statusCode: 200,
                    body: Buffer.from(`${JSON.stringify([
                        {
                            name: 'New Unique',
                            owner: 'Owner',
                            plugins: [],
                            repositoryName: 'Repo',
                            username: 'User',
                        },
                        {
                            name: 'Unique',
                            owner: 'Owner',
                            plugins: [],
                            repositoryName: 'Repo',
                            username: 'User',
                        },
                    ])}`)
                }));
            });
        });
        dataService.all();
        (producer.send as jasmine.Spy).and.callFake((event) => {
            expect(dataService.all().length).toBe(2);
            done();
        });
    });

    it('install should return package that\'s install', async (done) => {
        (context.install as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve) => resolve());
        });
        (web.send as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve) => {
                resolve(new Response({
                    statusCode: 200,
                    body: Buffer.from(`${JSON.stringify([
                        {
                            name: 'New Unique',
                            owner: 'Owner',
                            plugins: [],
                            repositoryName: 'Repo',
                            username: 'User',
                        }
                    ])}`)
                }));
            });
        });


        (producer.send as jasmine.Spy).and.callFake(async (value) => {
            const pluginPackage = await dataService.install({
                name: 'New Unique',
                owner: 'Owner',
                plugins: [],
                repositoryName: 'Repo',
                username: 'User',
                install: false,
            });
            expect(pluginPackage.install).toBeTruthy();
            expect(context.install).toHaveBeenCalled();
            done();
        });

        dataService.all();
    });

    it('install should call save package that\'s install', async (done) => {
        (context.install as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve) => resolve());
        });
        (settings.set as jasmine.Spy).and.callFake((_key, value) => {
            expect(value.length).toBe(2);
            expect(context.install).toHaveBeenCalled();
            done();
        });
        (web.send as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve) => {
                resolve(new Response({
                    statusCode: 200,
                    body: Buffer.from(`${JSON.stringify([
                        {
                            name: 'New Unique',
                            owner: 'Owner',
                            plugins: [],
                            repositoryName: 'Repo',
                            username: 'User',
                        }
                    ])}`)
                }));
            });
        });


        (producer.send as jasmine.Spy).and.callFake(async (value) => {
            await dataService.install({
                name: 'New Unique',
                owner: 'Owner',
                plugins: [],
                repositoryName: 'Repo',
                username: 'User',
                install: false,
            });
        });

        dataService.all();

    });

    it('uninstall should set package install to false', async () => {
        const pluginPackage = await dataService.uninstall({
            name: 'Unique',
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'User',
            install: true,
        });

        expect(pluginPackage.install).toBeFalsy();
    });


    it('uninstall should save packages', async (done) => {
        (context.uninstall as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve) => resolve());
        });
        (settings.set as jasmine.Spy).and.callFake((_key, value) => {
            expect(value.length).toBe(packages.length - 1);
            expect(context.uninstall).toHaveBeenCalled();
            done();
        });
        await dataService.uninstall({
            name: 'Unique',
            owner: 'Owner',
            plugins: [],
            repositoryName: 'Repo',
            username: 'User',
            install: true,
        });
    });


    it('all should call error when web returns a  non positive status', (done) => {
        (web.send as jasmine.Spy).and.callFake((value) => {
            return new Response({
                statusCode: 404,
            });
        });
        (producer.send as jasmine.Spy).and.callFake((value) => {
            done();
        });

        dataService.all();
    });

    it('install should throw for unknown package', async (done) => {
        try {
            await dataService.install({
                name: '404',
                owner: 'Owner',
                plugins: [],
                repositoryName: 'Repo',
                username: 'User',
                install: false
            });
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });


    it('uninstall should throw for unknown package', async (done) => {
        try {
            await dataService.uninstall({
                name: '404',
                owner: 'Owner',
                plugins: [],
                repositoryName: 'Repo',
                username: 'User',
                install: false
            });
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });




});


