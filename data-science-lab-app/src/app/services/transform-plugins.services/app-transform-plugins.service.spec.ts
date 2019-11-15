import { MockZone } from '../mock-zone';
import { AppTransformPluginsService  } from './app-transform-plugins.service';
import { SelectTransformPlugin, Plugin } from '../../../../shared/models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';


describe('Angular App Transform Plugins Service Tests', () => {

    let transformPluginsService: AppTransformPluginsService;
    let ipcService: MockIpcService;
    let transformPlugins: SelectTransformPlugin[];
    let zone: MockZone;

    const getAllEvent = (event, ...arg): void => {
        ipcService.send(ExperimentsEvents.GetAllTransformPluginsListeners, transformPlugins);
    };

    beforeAll(() => {
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        transformPlugins = [
            new SelectTransformPlugin({
                plugin: new Plugin({name: 'name', className: 'class', type: 'type', description: 'desc'}),
            }),
            new SelectTransformPlugin({
                plugin: new Plugin({name: 'name', className: 'class', type: 'type', description: 'desc'}),
            }),
        ];
        ipcService.on(ExperimentsEvents.GetAllTransformPluginsEvent, getAllEvent);
        transformPluginsService = new AppTransformPluginsService(ipcService, zone);
    });

    afterEach(() => {
        ipcService.removeListenersFromAllChannels();
        transformPluginsService.ngOnDestroy();
    });

    it('all should call plugins changed', (done) => {
        transformPluginsService.transformPluginsChanged.subscribe((value) => {
            expect(value.length).toBe(transformPlugins.length);
            done();
        });
        transformPluginsService.all();
    });

});
