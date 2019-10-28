import { MockIpcService } from '../../../../shared/services';
import { PackagesEvents } from '../../../../shared/events';
import { AppPackageProducer } from './app-package.producer';
import { PluginPackage, PluginPackageList, Plugin } from '../../../../shared/models';

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
            const list = JSON.parse(json) as PluginPackageList;
            expect(list.packages.length).toBe(1);
            done();
        });
        appPackageProducer.all(pluginPackageList);
    });
});
