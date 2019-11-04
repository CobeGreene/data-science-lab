import { MockPluginManagerAdapter } from './mock-plugin-manager.adapter';
import { AppQueuePluginManagerAdpater } from './app-queue-plugin-manager.adapter';
import { PluginPackage, Plugin } from '../../../../shared/models';


describe('Electron App Queue Plugin Manager Adapter Tests', () => {

    const pluginPackage = new PluginPackage({
        name: 'name',
        owner: 'owner',
        repositoryName: 'repo',
        username: 'username'
    });

    const plugin = new Plugin({
        name: 'name',
        className: 'className',
        description: 'desc',
        type: 'type'
    });

    it('activate and deactivate should call mock deactivate', async (done) => {
        const mock = new MockPluginManagerAdapter();
        mock.deactivate = (_, _plugin) => {
            return new Promise((resolve) => {
                done();
                resolve();
            });
        };
        const queue = new AppQueuePluginManagerAdpater(mock);
        await queue.activate(pluginPackage, plugin);
        await queue.deactivate(pluginPackage, plugin);
    });

    it('activate twice and deactivate should not call mock deactivate', async (done) => {
        const mock = new MockPluginManagerAdapter();
        mock.deactivate = (_, _plugin) => {
            throw new Error('error');
        };
        const queue = new AppQueuePluginManagerAdpater(mock);
        await queue.activate(pluginPackage, plugin);
        await queue.activate(pluginPackage, plugin);
        await queue.deactivate(pluginPackage, plugin);
        done();
    });

});
