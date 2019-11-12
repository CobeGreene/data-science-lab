import { AppPackageDataService } from './app-package.data-service';
import { PluginPackage, PluginPackageList, Plugin } from '../../../../shared/models';
import { MockDocumentContext, MockPluginContext } from '../../contexts';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockSettingsDataService } from '../settings-data-service';
import { MockWebCoreService } from '../../core-services';
import { Response } from 'data-science-lab-core';


describe('Electron App Package Data Service Tests', () => {

    let packageDataService: AppPackageDataService;
    let documentContext: MockDocumentContext;
    let serviceContainer: MockServiceContainer;
    let pluginPackageList: PluginPackageList;
    let pluginContext: MockPluginContext;
    let settingService: MockSettingsDataService;
    let webService: MockWebCoreService;
    let packageToInstall: PluginPackage;

    const documentGet = (): any => {
        return pluginPackageList;
    };

    beforeEach(() => {
        packageToInstall = new PluginPackage({
            name: 'new', owner: 'owner', repositoryName: 'repo', username: 'user'
        });
        pluginPackageList = new PluginPackageList([
            new PluginPackage({ name: 'name1', owner: 'owner1', repositoryName: 'repo1', username: 'user1', install: true }),
            new PluginPackage({ name: 'name2', owner: 'owner2', repositoryName: 'repo2', username: 'user2', install: true }),
        ]);
        settingService = new MockSettingsDataService();
        webService = new MockWebCoreService();
        webService.send = (request) => {
            return new Promise<Response>((resolve) => {
                resolve(new Response({
                    statusCode: 200,
                    body: Buffer.from(JSON.stringify([
                        pluginPackageList.packages[0],
                        pluginPackageList.packages[1],
                        packageToInstall,
                    ]))
                }));
            });
        };
        serviceContainer = new MockServiceContainer();
        documentContext = new MockDocumentContext();
        pluginContext = new MockPluginContext();
        packageDataService = new AppPackageDataService(serviceContainer);
        documentContext.get = <T>(path: string, defaultValue?: T): T => {
            return documentGet() as T;
        };
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.DocumentContext:
                    return documentContext;
                case SERVICE_TYPES.PluginContext:
                    return pluginContext;
                case SERVICE_TYPES.WebService:
                    return webService;
                case SERVICE_TYPES.SettingsDataService:
                    return settingService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
    });

    it('all should return list pf plugins.', () => {
        const list = packageDataService.all();
        expect(list.packages.length).toBe(pluginPackageList.packages.length);
    });

    it('read should return first package.', () => {
        const pluginPackage = packageDataService.read(pluginPackageList.packages[0].name);
        expect(pluginPackage.owner).toBe(pluginPackageList.packages[0].owner);
    });

    it('read should throw for not found package.', () => {
        expect(() => {
            packageDataService.read('not found');
        }).toThrowError();
    });

    it('install should throw exception for whats already in list', (done) => {
        packageDataService.install(pluginPackageList.packages[0])
            .then((_) => {
                done.fail(`Didn't expect successful execution.`);
            }).catch((reason) => {
                expect().nothing();
                done();
            });
    });

    it('install should add to installed package list', (done) => {
        const expected = pluginPackageList.packages.length + 1;
        packageDataService.all((list) => {
            packageDataService.install(packageToInstall)
                .then(() => {
                    expect(packageDataService.all().packages.filter((value) => {
                        return value.install;
                    }).length).toBe(expected);
                    done();
                });
        });
    });

    it('uninstall should remove from install package list', async () => {
        packageDataService.all();
        const expected = pluginPackageList.packages.length - 1;
        await packageDataService.uninstall(pluginPackageList.packages[0].name);
        expect(packageDataService.all().packages.filter((value) => {
            return value.install;
        }).length).toBe(expected);
    });

    it('uninstall should reject for not found package', (done) => {
        packageDataService.all();
        packageDataService.uninstall('not found')
            .then(() => {
                done.fail(`Didn't expect successful execution.`);
            }).catch((reason) => {
                expect().nothing();
                done();
            });
    });

    it('find should get package with plugin that has its name', () => {
        const plugin = new Plugin({
            name: 'plugin',
            className: 'class',
            description: 'desc',
            type: 'type',
            packageName: pluginPackageList.packages[0].name
        });
        const find = packageDataService.find(plugin);
        expect(find.owner).toEqual(pluginPackageList.packages[0].owner);
    }); 

    
    it('find should return undefined for not found', () => {
        const plugin = new Plugin({
            name: 'plugin',
            className: 'class',
            description: 'desc',
            type: 'type',
            packageName: 'not found'
        });
        const find = packageDataService.find(plugin);
        expect(find).toBeUndefined();
    }); 



});

