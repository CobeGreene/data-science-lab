import { AppAlgorithmDataService } from './app-algorithm.data-service';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { ExperimentAlgorithm } from '../../models';
import { MockPluginContext } from '../../contexts';



describe('Electron App Experiment Data Service Serivice Tests', () => {
    let dataGroupDataService: AppAlgorithmDataService;
    let serviceContainer: MockServiceContainer;
    let context: MockPluginContext;

    beforeEach(() => {
        context = new MockPluginContext();
        context.deactivate = () => {
            return new Promise<void>((resolve, reject) => {
                resolve();
            });
        };
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type) => {
            switch (type) {
                case SERVICE_TYPES.PluginContext:
                    return context;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
        dataGroupDataService = new AppAlgorithmDataService(serviceContainer);
    });

    it('all should return empty list', () => {
        const groups = dataGroupDataService.all();
        expect(groups.length).toEqual(0);
    });

    it('all should return two after created twice', () => {
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '1',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '2',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        expect(dataGroupDataService.all().length).toEqual(2);
    });

    it('all should return one algorithm for experiment id 2', () => {
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '1',
            experimentId: 2,
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '2',
            experimentId: 1,
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '3',
            experimentId: 2,
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        expect(dataGroupDataService.all(1).length).toEqual(1);
    });

    it('create should create with id one', () => {
        const dataGroup = dataGroupDataService.create(new ExperimentAlgorithm({
            label: '1',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        expect(dataGroup.id).toBe(1);
    });

    it('create should create a second with id two', () => {
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '1',
            experimentId: 2,
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        const dataGroup = dataGroupDataService.create(new ExperimentAlgorithm({
            label: '2',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        expect(dataGroup.id).toBe(2);
    });


    it('read should throw for no algorithm', () => {
        expect(() => {
            dataGroupDataService.read(404);
        }).toThrowError();
    });

    it('read should throw with non existent algorithm even with algorithms', () => {
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '1',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '2',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        expect(() => {
            dataGroupDataService.read(404);
        }).toThrowError();
    });

    it('read should return algorithm', () => {
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '1',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '2',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        expect(dataGroupDataService.read(1).label).toEqual('1');
    });

    it('update should throw for no algorithms', () => {
        expect(() => {
            dataGroupDataService.update(new ExperimentAlgorithm({
                id: 404, label: '1',
                algorithmPlugin: undefined,
                plugin: undefined,
                pluginPackage: undefined
            }));
        }).toThrowError();
    });

    it('update should throw with non existent algorithm even with algorithms', () => {
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '1',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '2',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        expect(() => {
            dataGroupDataService.update(new ExperimentAlgorithm({
                id: 404,
                label: '3',
                algorithmPlugin: undefined,
                plugin: undefined,
                pluginPackage: undefined
            }));
        }).toThrowError();
    });

    it('update should update algorithm', () => {
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '1',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '2',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.update(new ExperimentAlgorithm({
            id: 1,
            label: '3',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        expect(dataGroupDataService.read(1).label).toEqual('3');
    });

    it('delete should decrease the length of list', () => {
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '1',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.delete(1);
        expect(dataGroupDataService.all().length).toBe(0);
    });

    it('delete should throw for no algorithm', () => {
        expect(() => {
            dataGroupDataService.delete(404);
        }).toThrowError();
    });

    it('delete should throw with non existent data even with groups', () => {
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '1',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '2',
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        expect(() => {
            dataGroupDataService.delete(404);
        }).toThrowError();
    });

    it('delete by experiment should remove all in experiment', () => {
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '1',
            experimentId: 2,
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '2',
            experimentId: 1,
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.create(new ExperimentAlgorithm({
            label: '3',
            experimentId: 2,
            algorithmPlugin: undefined,
            plugin: undefined,
            pluginPackage: undefined
        }));
        dataGroupDataService.deleteByExperiment(2);
        expect(dataGroupDataService.all().length).toBe(1);
    });

});
