import { AppInstalledPackageDataService } from './app-installed-package.data-service';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { MockDocumentContext, MockPluginContext } from '../../contexts';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';


describe('Electron App Installed Package Data Service Tests', () => {

    let installPackageDataService: AppInstalledPackageDataService;
    let documentContext: MockDocumentContext;
    let serviceContainer: MockServiceContainer;
    let pluginPackageList: PluginPackageList;
    let pluginContext: MockPluginContext;

    const documentGet = (): any => {
        return pluginPackageList;
    };

    beforeEach(() => {
        pluginPackageList = new PluginPackageList([
            new PluginPackage({ name: 'name1', owner: 'owner1', repositoryName: 'repo1', username: 'user1', install: true }),
            new PluginPackage({ name: 'name2', owner: 'owner2', repositoryName: 'repo2', username: 'user2', install: true }),
        ]);
        serviceContainer = new MockServiceContainer();
        documentContext = new MockDocumentContext();
        pluginContext = new MockPluginContext();
        installPackageDataService = new AppInstalledPackageDataService(serviceContainer);
        documentContext.get = <T>(path: string, defaultValue?: T): T => {
            return documentGet() as T;
        };
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.DocumentContext:
                    return documentContext;
                case SERVICE_TYPES.PluginContext:
                    return pluginContext;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
    });

    it('all should return list pf plugins.', () => {
        const list = installPackageDataService.all();
        expect(list.packages.length).toBe(pluginPackageList.packages.length);
    });

    it('read should return first package.', () => {
        const pluginPackage = installPackageDataService.read(pluginPackageList.packages[0].name);
        expect(pluginPackage.owner).toBe(pluginPackageList.packages[0].owner);
    });

    it('read should throw for not found package.', () => {
        expect(() => {
            installPackageDataService.read('not found');
        }).toThrowError();
    });

    it('install should throw exception for whats already in list', (done) => {
        installPackageDataService.install(pluginPackageList.packages[0])
            .then((_) => {
                done.fail(`Didn't expect successful execution.`);
            }).catch((reason) => {
                expect().nothing();
                done();
            });
    });

    it('install should add to installed package list', async () => {
        const expected = pluginPackageList.packages.length + 1;
        const pluginPackage = new PluginPackage({
            name: 'new', owner: 'owner', repositoryName: 'repo', username: 'user'
        });
        
        await installPackageDataService.install(pluginPackage);
        expect(installPackageDataService.all().packages.length).toBe(expected);
    });

    it('uninstall should remove from install package list', async () => {
        const expected = pluginPackageList.packages.length - 1;
        await installPackageDataService.uninstall(pluginPackageList.packages[0].name);
        expect(installPackageDataService.all().packages.length).toBe(expected);
    });

    it('uninstall should reject for not found package', (done) => {
        installPackageDataService.uninstall('not found')
            .then(() => {
                done.fail(`Didn't expect successful execution.`);
            }).catch((reason) => {
                expect().nothing();
                done();
            });
    });

});

