import { AppAlgorithmPluginsDataService  } from './app-algorithm-plugins.data-service';
import { PluginPackage, Plugin, PluginPackageList } from '../../../../shared/models';
import { SERVICE_TYPES, MockServiceContainer } from '../../services-container';
import { MockPackageDataService } from '../package-data-service';
import { PluginTypes } from 'data-science-lab-core';
import { MockPluginContext } from '../../contexts';


describe('Electron App Algorithm Plugins Data Service Tests', () => {

    class MockAlgorithmInputs {
        inputs() {
            return [];
        }
    }

    class MockAlgorithm {
        getInputs() {
            return (new MockAlgorithmInputs());
        }
    }

    let packageDataService: MockPackageDataService;
    let pluginContext: MockPluginContext;
    let dataService: AppAlgorithmPluginsDataService;
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
                        type: PluginTypes.Algorithm,
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
                        type: PluginTypes.Algorithm,
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
                        type: PluginTypes.Algorithm,
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
            return new Promise<T>((resolve) => {
                resolve((new MockAlgorithm() as unknown) as T); 
            });
        };
        dataService = new AppAlgorithmPluginsDataService(serviceContainer);
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
        }, () => {
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

    it('install plugin package should add a algorithm plugin', (done) => {
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
                    type: PluginTypes.Algorithm,
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
                    type: PluginTypes.Algorithm,
                })
            ],
            install: true,                
        })).catch(() => {
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

