import { MockIpcService } from '../../../../shared/services';
import { PackagesEvents } from '../../../../shared/events';
import { AppPackageProducer } from './app-package.producer';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { deserialize } from 'typescript-json-serializer';

describe('Electron App Package Producer Tests', () => {
    let ipcService: MockIpcService;
    let appPackageProducer: AppPackageProducer;

    beforeAll(() => {
        ipcService = new MockIpcService();
        appPackageProducer = new AppPackageProducer(ipcService);
    });

    beforeEach(() => {
       ipcService.removeListenersFromAllChannels(); 
    });

    it('all event should serialize package plugins', (done) => {
        const pluginPackageList = new PluginPackageList([
            new PluginPackage({
                name: 'name',
                owner: 'owner',
                repositoryName: 'repo',
                username: 'username'
            })
        ]);
        ipcService.on(PackagesEvents.GetAllListeners, (_event, args) => {
            const json = args[0];
            const list = deserialize<PluginPackageList>(json, PluginPackageList);
            expect(list.packages.length).toBe(pluginPackageList.packages.length);
            done();
        });
        appPackageProducer.all(pluginPackageList);
    });
});
