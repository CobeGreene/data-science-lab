import { MockZone } from '../mock-zone';
import { AppAlgorithmPluginsService } from './app-algorithm-plugins.service';
import { Plugin } from '../../../../shared/models';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';


describe('Angular App Algorithm Plugins Service Tests', () => {

    let pluginsService: AppAlgorithmPluginsService;
    let ipcService: MockIpcService;
    let plugins: AlgorithmPluginViewModel[];
    let zone: MockZone;

    const getAllEvent = (event, ...arg): void => {
        ipcService.send(ExperimentsEvents.GetAllAlgorithmPluginsListeners, plugins);
    };

    beforeAll(() => {
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        plugins = [
            new AlgorithmPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }),
            new AlgorithmPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }),
        ];
        ipcService.on(ExperimentsEvents.GetAllAlgorithmPluginsEvent, getAllEvent);
        pluginsService = new AppAlgorithmPluginsService(ipcService, zone);
    });

    afterEach(() => {
        ipcService.removeListenersFromAllChannels();
        pluginsService.ngOnDestroy();
    });

    it('all should call plugins changed', (done) => {
        pluginsService.algorithmPluginsChanged.subscribe((value) => {
            expect(value.length).toBe(plugins.length);
            done();
        });
        pluginsService.all();
    });

    it('get should throw for not found', () => {
        expect(() => {
            pluginsService.get(404);
        }).toThrowError();
    });

    it('select should add the selected subject', (done) => {
        pluginsService.algorithmPluginSelected.subscribe((value) => {
            expect(value.dataGroupId).toBe(1);
            done();
        });
        pluginsService.select(1,
            new AlgorithmPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
    });
    
    it('select should update the selected subject', (done) => {
        pluginsService.select(1, 
            new AlgorithmPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
        pluginsService.algorithmPluginSelected.subscribe((value) => {
            expect(value.dataGroupId).toBe(1);
            done();
        });
        pluginsService.select(1, 
            new AlgorithmPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
    });

    it('get should return plugin after selected', () => {
        pluginsService.select(1,
            new AlgorithmPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
        const transformPlugin = pluginsService.get(1);
        expect(transformPlugin.plugin.name).toBe('name');
    });

    it('deselect should throw for get after deselected', () => {
        pluginsService.select(1,
            new AlgorithmPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
        pluginsService.deselect(1);
        expect(() => {
            pluginsService.get(1);
        }).toThrowError();
    });

});
