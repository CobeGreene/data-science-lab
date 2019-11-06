import { MockZone } from '../mock-zone';
import { AppExperimentSelectFetchService } from './app-experiment-select-fetch.service';
import { ExperimentsEvents } from '../../../../shared/events';
import { Plugin } from '../../../../shared/models';
import { MockIpcService } from '../../../../shared/services';

describe('Angular App Experiment Select Fetch Service Tests', () => {
    let experimentService: AppExperimentSelectFetchService;
    let ipcService: MockIpcService;
    let pluginList: Plugin[];
    let zone: MockZone;

    const getAllEvent = (event, arg): void => {
        ipcService.send(ExperimentsEvents.GetAllFetchPluginsListener, pluginList);
    };

    beforeAll(() => {
        pluginList = [
            new Plugin({ name: 'name', className: 'class', description: 'desc', packageName: 'package', type: 'FETCH' })
        ];
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        ipcService.on(ExperimentsEvents.GetAllFetchPluginsEvent, getAllEvent);
        experimentService = new AppExperimentSelectFetchService(ipcService, zone);
    });

    afterEach(() => {
        experimentService.ngOnDestroy();
        ipcService.removeListenersFromAllChannels();
    });

    it('all should send a request to ipc and get back items', (done) => {
        experimentService.fetchPlugins.subscribe((value: Plugin[]) => {
            expect(value.length).toEqual(pluginList.length);
            done();
        });
        experimentService.all();
    });

    it('select should call select event', (done) => {
        ipcService.on(ExperimentsEvents.SelectFetchEvent, (event, args: any[]) => {
            expect(args[0] as number).toBe(1);
            const plugin = args[1] as Plugin;
            expect(plugin.name).toEqual(pluginList[0].name);
            done();
        });
        experimentService.select(1, pluginList[0]);
    });
});

