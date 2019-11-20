import { AppSelectTransformPluginsDataService } from './app-select-transform-plugins.data-service';
import { SelectTransformPlugin, PluginPackage, Plugin, SelectTransformPluginInput, PluginPackageList } from '../../../../shared/models';
import { ServiceContainer, SERVICE_TYPES, MockServiceContainer } from '../../services-container';
import { PackageDataService, MockPackageDataService } from '../package-data-service';
import { PluginTypes, TransformPlugin } from 'data-science-lab-core';
import { PluginContext, MockPluginContext } from '../../contexts';


describe('Electron App Transform Plugins Data Service Tests', () => {

    class MockTransformInputs {
        inputs() {
            return [];
        }
    }

    class MockTransform {
        getInputs() {
            return (new MockTransformInputs());
        }
    }

    let packageDataService: MockPackageDataService;
    let pluginContext: MockPluginContext;
    let dataService: AppSelectTransformPluginsDataService;
    let packagesList: PluginPackageList;
    let serviceContainer: MockServiceContainer;

    beforeAll(() => {
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.PluginContext:
                    return pluginContext;
                case SERVICE_TYPES.PackageDataService:
                    return packageDataService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
    });
    
    beforeEach(() => {
        packagesList = new PluginPackageList([
            new PluginPackage({
                name: 'name',
                owner: 'owner',
                repositoryName: 'repo',
                username: 'user',
                plugins: [
                    new Plugin({
                        name: 'plugin',
                        className: 'class',
                        description: 'desc',
                        type: PluginTypes.Transform,
                    }),
                    new Plugin({
                        name: 'plugin',
                        className: 'class',
                        description: 'desc',
                        type: PluginTypes.Fetch,
                    }),
                ],
                install: true,                
            }),
            new PluginPackage({
                name: 'name2',
                owner: 'owner2',
                repositoryName: 'repo2',
                username: 'user2',
                plugins: [
                    new Plugin({
                        name: 'plugin',
                        className: 'class',
                        description: 'desc',
                        type: PluginTypes.Transform,
                    })
                ],
                install: true,                
            }),
            new PluginPackage({
                name: 'name3',
                owner: 'owner3',
                repositoryName: 'repo3',
                username: 'user3',
                plugins: [
                    new Plugin({
                        name: 'plugin',
                        className: 'class',
                        description: 'desc',
                        type: PluginTypes.Transform,
                    })
                ],
                install: false,                
            }),
        ]);
        packageDataService = new MockPackageDataService();
        packageDataService.all = () => {
            return packagesList;
        };
        pluginContext = new MockPluginContext();
        pluginContext.activate = <T>() => {
            return new Promise<T>((resolve, reject) => {
                resolve((new MockTransform() as unknown) as T); 
            });
        };
        dataService = new AppSelectTransformPluginsDataService(serviceContainer);
    });

    it('all should return install plugins', (done) => {
        dataService.all((value) => {
            expect(value.length).toBe(2);
            done();
        });
    });

    it('all should throw when activate throws', (done) => {
        pluginContext.activate = <T>() => {
            return new Promise<T>((resolve, reject) => {
                reject(new Error(`Couldn't activate`));
            });
        };
        let amount = 0;
        dataService.all((value) => {
            expect(value.length).toBe(0);
            expect(amount).toBe(2);
            done();
        }, (reason: any) => {
            expect().nothing();
            amount++;
        });
    });

    it('all should return when activate throws', (done) => {
        pluginContext.activate = <T>() => {
            return new Promise<T>((resolve, reject) => {
                reject(new Error(`Couldn't activate`));
            });
        };
        dataService.all((value) => {
            expect(value.length).toBe(0);
            done();
        });
    });

    it('install plugin package should add a transform plugin', (done) => {
        dataService.install(new PluginPackage({
            name: 'name4',
            owner: 'owner4',
            repositoryName: 'repo4',
            username: 'user4',
            plugins: [
                new Plugin({
                    name: 'plugin',
                    className: 'class',
                    description: 'desc',
                    type: PluginTypes.Transform,
                })
            ],
            install: true,                
        })).then((value) => {
            expect(value.length).toBe(3);
            done();
        });
    });

    it('install plugin package should throw when activate throws', (done) => {
        pluginContext.activate = <T>() => {
            return new Promise<T>((resolve, reject) => {
                reject(new Error(`Couldn't activate`));
            });
        };
        dataService.install(new PluginPackage({
            name: 'name4',
            owner: 'owner4',
            repositoryName: 'repo4',
            username: 'user4',
            plugins: [
                new Plugin({
                    name: 'plugin',
                    className: 'class',
                    description: 'desc',
                    type: PluginTypes.Transform,
                })
            ],
            install: true,                
        })).catch((value) => {
            done();
        }); 
    });

    it('uninstall plugin package should decrease plugins with package name', (done) => {
        dataService.uninstall(packagesList.packages[0])
            .then((value) => {
                expect(value.length).toBe(1);
                done();
            });
    });

    it('uninstall plugin package should throw when plugin context throws', (done) => {
        pluginContext.activate = <T>() => {
            return new Promise<T>((resolve, reject) => {
                reject(new Error(`Couldn't activate`));
            });
        };
        dataService.uninstall(packagesList.packages[0])
            .then((value) => {
                expect(value.length).toBe(0);
                done();
            });
    });

});

