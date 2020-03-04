import { AppSessionPluginDataService } from './app-session-plugin.data-service';
import { PackageDataService } from '../package-data-service';
import { PluginContext } from '../../contexts/plugin-context';
import { ErrorEvent, PackageEvents } from '../../../../shared/events';
import { PluginTypes, PluginInputs } from 'data-science-lab-core';
import { Producer } from '../../pipeline';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';

describe('Electron App Session Plugin Data Service', () => {
    let service: AppSessionPluginDataService;
    let producer: Producer;
    let dataService: PackageDataService;
    let context: PluginContext;
    let serviceContainer: ServiceContainer;

    beforeEach(() => {
        producer = jasmine.createSpyObj('Producer', ['send']);
        context = jasmine.createSpyObj('PluginContext', ['install', 'uninstall', 'activate', 'deactivate']);
        dataService = jasmine.createSpyObj('PackageDataService', ['all']);

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.Producer) {
                return producer;
            } else if (type === SERVICE_TYPES.PackageDataService) {
                return dataService;
            } else if (type === SERVICE_TYPES.PluginContext) {
                return context;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });

        service = new AppSessionPluginDataService(serviceContainer);
    });

    it('all should return empty list initially', () => {
        (dataService.all as jasmine.Spy).and.callFake(() => {
            return [];
        });
        expect(service.all().length).toBe(0);
    });

    it('all should call producer change', (done) => {
        (dataService.all as jasmine.Spy).and.callFake(() => {
            return [];
        });
        (producer.send as jasmine.Spy).and.callFake((event) => {
            expect(event).toBe(PackageEvents.SessionChange);
            done();
        });

        service.all();
    });

    it('all should add three transform plugins', (done) => {
        (context.activate as jasmine.Spy).and.callFake(async () => {
            const pluginInputs = jasmine.createSpyObj('PluginInputs', ['inputs']);
            const plugin = jasmine.createSpyObj('TransformPlugin', ['getInputs']);
            (plugin.getInputs as jasmine.Spy).and.callFake(() => {
                return pluginInputs;
            });
            return plugin;
        });
        (dataService.all as jasmine.Spy).and.callFake(() => {
            return [
                {
                    name: 'Name',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        }
                    ],
                    install: true,
                },
                {
                    name: 'Name2',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        }
                    ],
                    install: false,
                },
                {
                    name: 'Name3',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Fetch,
                            packageName: 'Name'
                        },
                        {
                            name: 'Name2',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        },
                        {
                            name: 'Name3',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        }
                    ],
                    install: true,
                },
            ];
        });

        (producer.send as jasmine.Spy).and.callFake((event) => {
            if (event === PackageEvents.SessionChange) {
                const plugins = service.all();
                expect(plugins.length).toBe(3);
                expect(context.deactivate).toHaveBeenCalledTimes(3);
                done();
            }
        });

        service.all();
    });

    it('all should throw error to happen on plugin while adding other plugins', (done) => {
        let count = 0;
        (context.activate as jasmine.Spy).and.callFake(async () => {
            if (count === 0) {
                count++;
                throw new Error('activate error');
            }
            const pluginInputs = jasmine.createSpyObj('PluginInputs', ['inputs']);
            const plugin = jasmine.createSpyObj('TransformPlugin', ['getInputs']);
            (plugin.getInputs as jasmine.Spy).and.callFake(() => {
                return pluginInputs;
            });
            count++;
            return plugin;
        });
        (dataService.all as jasmine.Spy).and.callFake(() => {
            return [
                {
                    name: 'Name',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        }
                    ],
                    install: true,
                },
                {
                    name: 'Name2',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        }
                    ],
                    install: false,
                },
                {
                    name: 'Name3',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Fetch,
                            packageName: 'Name'
                        },
                        {
                            name: 'Name2',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        },
                        {
                            name: 'Name3',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        }
                    ],
                    install: true,
                },
            ];
        });

        let error = false;

        (producer.send as jasmine.Spy).and.callFake((event) => {
            if (event === PackageEvents.SessionChange) {
                const plugins = service.all();
                expect(plugins.length).toBe(2);
                expect(context.deactivate).toHaveBeenCalledTimes(2);
                expect(error).toBeTruthy();
                done();
            } else if (event === ErrorEvent) {
                error = true;
            }
        });

        service.all();
    });

    it('install should add a transform plugins', (done) => {
        (context.activate as jasmine.Spy).and.callFake(async () => {
            const pluginInputs = jasmine.createSpyObj('PluginInputs', ['inputs']);
            const plugin = jasmine.createSpyObj('TransformPlugin', ['getInputs']);
            (plugin.getInputs as jasmine.Spy).and.callFake(() => {
                return pluginInputs;
            });
            return plugin;
        });
        (dataService.all as jasmine.Spy).and.callFake(() => {
            return [
                {
                    name: 'Name2',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        }
                    ],
                    install: false,
                },
                {
                    name: 'Name3',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Fetch,
                            packageName: 'Name'
                        },
                        {
                            name: 'Name2',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        },
                        {
                            name: 'Name3',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        }
                    ],
                    install: true,
                },
            ];
        });

        (producer.send as jasmine.Spy).and.callFake(async (event) => {
            if (event === PackageEvents.SessionChange) {
                await service.install({
                    name: 'Name',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        }
                    ],
                    install: true,
                    owner: '',
                    repositoryName: '',
                    username: ''
                });
                const plugins = service.all();
                expect(plugins.length).toBe(3);
                done();
            }
        });

        service.all();
    });
    
    it('uninstall should remove a transform plugins', (done) => {
        (context.activate as jasmine.Spy).and.callFake(async () => {
            const pluginInputs = jasmine.createSpyObj('PluginInputs', ['inputs']);
            const plugin = jasmine.createSpyObj('TransformPlugin', ['getInputs']);
            (plugin.getInputs as jasmine.Spy).and.callFake(() => {
                return pluginInputs;
            });
            return plugin;
        });
        (dataService.all as jasmine.Spy).and.callFake(() => {
            return [
                {
                    name: 'Name',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        }
                    ],
                    install: true,
                    owner: '',
                    repositoryName: '',
                    username: ''
                },
                {
                    name: 'Name2',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name2'
                        }
                    ],
                    install: false,
                },
                {
                    name: 'Name3',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Fetch,
                            packageName: 'Name3'
                        },
                        {
                            name: 'Name2',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name3'
                        },
                        {
                            name: 'Name3',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name3'
                        }
                    ],
                    install: true,
                },
            ];
        });

        (producer.send as jasmine.Spy).and.callFake(async (event) => {
            if (event === PackageEvents.SessionChange) {
                await service.uninstall({
                    name: 'Name',
                    plugins: [
                        {
                            name: 'Name',
                            className: 'Class',
                            description: 'Desc',
                            type: PluginTypes.Transform,
                            packageName: 'Name'
                        }
                    ],
                    install: false,
                    owner: '',
                    repositoryName: '',
                    username: ''
                });
                const plugins = service.all();
                expect(plugins.length).toBe(2);
                done();
            }
        });

        service.all();
    });


});


