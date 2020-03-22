import { PluginContext } from './plugin.context';
import { AppQueuePluginContext } from './app-queue-plugin.context';
import { Package, Plugin } from '../../../../shared/models';
import { ServiceContainer } from '../../service-container';

export class MockPluginContext implements PluginContext {
    public configure: () => void;
    public install: (pluginPackage: Package) => Promise<void>;
    public uninstall: (pluginPackage: Package) => Promise<void>;
    public activate: <T>(pluginPackage: Package, plugin: Plugin) => Promise<T>;
    public deactivate: (pluginPackage: Package, plugin: Plugin) => Promise<void>;
    public deactivateAll: () => Promise<void>;

    constructor() {
        this.reset();
    }

    public reset() {
        this.configure = () => {};
        this.install = (_) => new Promise<void>((resolve) => { resolve(); });
        this.uninstall = (_) => new Promise<void>((resolve) => { resolve(); });
        this.activate = <T>(_package, _plugin) => new Promise<T>((resolve, _) => { resolve(new Object() as T); });
        this.deactivate = (_package, _plugin) => new Promise<void>((resolve, _) => { resolve(); });
        this.deactivateAll = () => new Promise<void>((resolve) => { resolve(); });
    }
}


describe('Electron App Queue Plugin Context Tests', () => {
    const pluginPackage: Package = {
        name: 'name',
        owner: 'owner',
        repositoryName: 'repo',
        username: 'username',
        install: false,
        plugins: []
    };

    const plugin: Plugin = {
        name: 'name',
        className: 'className',
        description: 'desc',
        type: 'type'
    };

    let serviceContainer: ServiceContainer;
    let mock: MockPluginContext;

    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake(() => {
            return mock;
        });
    });

    it('activate and deactivate should call mock deactivate', async (done) => {
        mock = new MockPluginContext();
        mock.deactivate = (_, _plugin) => {
            return new Promise((resolve) => {
                done();
                resolve();
            });
        };
        const queue = new AppQueuePluginContext(serviceContainer);
        await queue.activate(pluginPackage, plugin);
        await queue.deactivate(pluginPackage, plugin);
    });

    it('activate twice and deactivate should not call mock deactivate', async (done) => {
        mock = new MockPluginContext();
        mock.deactivate = (_, _plugin) => {
            throw new Error('error');
        };
        const queue = new AppQueuePluginContext(serviceContainer);
        await queue.activate(pluginPackage, plugin);
        await queue.activate(pluginPackage, plugin);
        await queue.deactivate(pluginPackage, plugin);
        done();
    });

});
