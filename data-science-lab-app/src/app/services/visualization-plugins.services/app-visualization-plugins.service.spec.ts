import { MockZone } from '../mock-zone';
import { AppVisualizationPluginsService } from './app-visualization-plugins.service';
import { Plugin } from '../../../../shared/models';
import { VisualizationPluginViewModel } from '../../../../shared/view-models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';

describe('Angular App Visualization Plugins Service Tests', () => {

    let visualizationPluginsService: AppVisualizationPluginsService;
    let ipcService: MockIpcService;
    let visualizationPlugins: VisualizationPluginViewModel[];
    let zone: MockZone;

    const getAllEvent = (event, ...arg): void => {
        ipcService.send(ExperimentsEvents.GetAllVisualizationPluginsListeners, visualizationPlugins);
    };

    beforeAll(() => {
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        visualizationPlugins = [
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }),
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),            }),
        ];

        ipcService.on(ExperimentsEvents.GetAllVisualizationPluginsEvent, getAllEvent);
        visualizationPluginsService = new AppVisualizationPluginsService(ipcService, zone);
    });

    afterEach(() => {
        visualizationPluginsService.ngOnDestroy();
        ipcService.removeListenersFromAllChannels();
    });

    it('all should call plugins changed', (done) => {
        visualizationPluginsService.visualizationPluginsChanged.subscribe((value) => {
            expect(value.length).toBe(visualizationPlugins.length);
            done();
        });
        visualizationPluginsService.all();
    });

    it('get data group should throw for not found', () => {
        expect(() => {
            visualizationPluginsService.getDataGroup(404);
        }).toThrowError();
    });

    it('get algorithm should throw for not found', () => {
        expect(() => {
            visualizationPluginsService.getAlgorithm(404);
        }).toThrowError();
    });

    it('select data group should add the selected subject', (done) => {
        visualizationPluginsService.visualizationPluginDataGroupSelected.subscribe((value) => {
            expect(value.dataGroupId).toBe(1);
            done();
        });
        visualizationPluginsService.selectDataGroup(1,
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
    });
    
    it('select data group should update the selected subject', (done) => {
        visualizationPluginsService.selectDataGroup(1, 
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
        visualizationPluginsService.visualizationPluginDataGroupSelected.subscribe((value) => {
            expect(value.dataGroupId).toBe(1);
            done();
        });
        visualizationPluginsService.selectDataGroup(1, 
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
    });

    it('get data group should return plugin after selected', () => {
        visualizationPluginsService.selectDataGroup(1,
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
        const visualizationPlugin = visualizationPluginsService.getDataGroup(1);
        expect(visualizationPlugin.plugin.name).toBe('name');
    });

    it('deselect data group should throw for get after deselected', () => {
        visualizationPluginsService.selectDataGroup(1,
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
        visualizationPluginsService.deselectDataGroup(1);
        expect(() => {
            visualizationPluginsService.getDataGroup(1);
        }).toThrowError();
    });    

    it('select algorithm should add the selected subject', (done) => {
        visualizationPluginsService.visualizationPluginAlgorithmSelected.subscribe((value) => {
            expect(value.algorithmId).toBe(1);
            done();
        });
        visualizationPluginsService.selectAlgorithm(1,
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
    });
    
    it('select algorithm should update the selected subject', (done) => {
        visualizationPluginsService.selectAlgorithm(1, 
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
        visualizationPluginsService.visualizationPluginAlgorithmSelected.subscribe((value) => {
            expect(value.algorithmId).toBe(1);
            done();
        });
        visualizationPluginsService.selectAlgorithm(1, 
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
    });

    it('get algorithm should return plugin after selected', () => {
        visualizationPluginsService.selectAlgorithm(1,
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
        const visualizationPlugin = visualizationPluginsService.getAlgorithm(1);
        expect(visualizationPlugin.plugin.name).toBe('name');
    });

    it('deselect algorithm should throw for get after deselected', () => {
        visualizationPluginsService.selectAlgorithm(1,
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'class', type: 'type', description: 'desc' }),
            }));
        visualizationPluginsService.deselectAlgorithm(1);
        expect(() => {
            visualizationPluginsService.getAlgorithm(1);
        }).toThrowError();
    });    




});


