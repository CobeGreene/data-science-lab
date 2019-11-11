import { MockZone } from '../mock-zone';
import { AppFetchPluginsService } from './app-fetch-plugins.service';
import { Plugin } from '../../../../shared/models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';


describe('Angular App Fetch Plugins Service Tests', () => {

    let fetchPluginService: AppFetchPluginsService;
    let ipcService: MockIpcService;
    let plugins: Plugin[];
    let zone: MockZone;

    const getAllEvent = (event, ...arg): void => {
        ipcService.send(ExperimentsEvents.GetAllFetchPluginsListeners, plugins);
    };

    beforeAll(() => {
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        plugins = [
            new Plugin({name: 'name', className: 'class', type: 'type', description: 'desc'}),
            new Plugin({name: 'name', className: 'class', type: 'type', description: 'desc'}),
        ];
        ipcService.on(ExperimentsEvents.GetAllFetchPluginsEvent, getAllEvent);
        fetchPluginService = new AppFetchPluginsService(ipcService, zone);
    });

    afterEach(() => {
        ipcService.removeListenersFromAllChannels();
        fetchPluginService.ngOnDestroy();
    });

    it('all should call plugins changed', (done) => {
        fetchPluginService.fetchPluginsChanged.subscribe((value: Plugin[]) => {
            expect(value.length).toBe(plugins.length);
            done();
        });
        fetchPluginService.all();
    });



});
