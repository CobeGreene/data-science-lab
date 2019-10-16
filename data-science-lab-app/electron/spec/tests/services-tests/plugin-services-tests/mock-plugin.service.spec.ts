import { MockPluginService } from '../../../../app/services/plugin-services/mock-plugin.service';
import { Plugin, Plugins } from '../../../../../shared/models';
import { deserialize } from 'typescript-json-serializer';
import * as PluginsEvents from '../../../../../shared/events/plugins-events';
import { ipcRenderer } from 'electron';

describe('Electron Mock Plugin Service Tests', () => {
    let pluginService: MockPluginService; 
    let plugins: Plugins;

    beforeAll(() => {
        plugins = new Plugins([
            new Plugin('first', 'owner1', 'repo1'),
            new Plugin('second', 'owner2', 'repo2'),
            new Plugin('third', 'owner3', 'repo3'),
        ]);
    });

    beforeEach(() => {
        const temp = new Plugins(plugins.plugins.slice());
        // pluginService = MockPluginService.init(temp, null);
    });

    it('get all should retrieve argument', (done) => {
        ipcRenderer.once(PluginsEvents.GetAllEvent, (event, arg) => {
            expect(arg).toBeDefined();
            done();
        });
    });
});
