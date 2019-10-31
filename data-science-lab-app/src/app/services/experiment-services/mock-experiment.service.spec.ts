import { MockExperimentService } from './mock-experiment.service';
import { Experiment, ExperimentList, ExperimentSelectFetchStage, Plugin, ExperimentSetupFetchStage } from '../../../../shared/models';
import { ExperimentStages } from '../../../../shared/models/experiment_stages';
import { ExperimentAlgorithmPlugins } from '../../models';
import { ExperimentService } from './experiment.service';

describe('Angular Mock Experiment Service Tests', () => {

    it('all should create service with no experiments', () => {
        const service = new MockExperimentService();
        expect(service.all().experiments.length).toBe(0);
    });

    it('init should create service with experiments', () => {
        const experimentsList = new ExperimentList(
            [
                new ExperimentSelectFetchStage({ id: 1 })
            ]
        );
        const service = MockExperimentService.init(experimentsList);
        expect(service.all().experiments.length)
            .toBe(experimentsList.experiments.length);
    });

    it('create should fire new experiment', (done) => {
        const service = new MockExperimentService();
        service.newExperiment.subscribe((value: Experiment) => {
            expect(value.id).toEqual(1);
            done();
        });
        service.create();
    });

    it('create should fire all experiments', (done) => {
        const service = new MockExperimentService();
        service.experimentsChanged.subscribe((value: ExperimentList) => {
            expect(value.experiments.length).toEqual(1);
            done();
        });
        service.create();
    });

    it('get should get experiment in list', () => {
        const experimentsList = new ExperimentList(
            [
                new ExperimentSelectFetchStage({ id: 1 })
            ]
        );
        const service = MockExperimentService.init(experimentsList);
        expect(service.get(experimentsList.experiments[0].id).stage)
            .toEqual(experimentsList.experiments[0].stage);
    });

    it('get should throw error for no experiments', () => {
        const service = new MockExperimentService();
        expect(() => {
            service.get(404);
        }).toThrowError();
    });

    it('get should throw error with experiments', () => {
        const experimentsList = new ExperimentList(
            [
                new ExperimentSelectFetchStage({ id: 1 }),
                new ExperimentSelectFetchStage({ id: 2 }),
            ]
        );
        const service = MockExperimentService.init(experimentsList);
        expect(() => {
            service.get(404);
        }).toThrowError();
    });


    it('get experiment algorithm plugins return first experiment plugins in the list', () => {
        const experimentAlgorithmPlugins = [
            new ExperimentAlgorithmPlugins({id: 1, algorithmPlugins: [
                new Plugin({name: 'name', className: 'className', description: 'desc', type: 'type'})
            ] 
        })];
        const service = MockExperimentService.init(new ExperimentList(), [], experimentAlgorithmPlugins);
        expect(service.getExperimentAlgorithmPlugins(1).algorithmPlugins.length)
            .toEqual(experimentAlgorithmPlugins[0].algorithmPlugins.length);
    });

    
    it('get experiment algorithm plugins return empty plugins for non-found experiment', () => {
        const experimentAlgorithmPlugins = [
            new ExperimentAlgorithmPlugins({id: 1, algorithmPlugins: [
                new Plugin({name: 'name', className: 'className', description: 'desc', type: 'type'})
            ] 
        })];
        const service = MockExperimentService.init(new ExperimentList(), [], experimentAlgorithmPlugins);
        expect(service.getExperimentAlgorithmPlugins(404).algorithmPlugins.length)
            .toEqual(0);
    });

    it('update experiment algorithm plugins should return 1 plugins', (done) => {
        const service = new MockExperimentService();
        service.experimentAlgorithmPlugins.subscribe((value) => {
            expect(value.algorithmPlugins.length).toEqual(1);
            done();
        });
        service.updateExperimentAlgorithmPlugins(1, [
            new Plugin({name: 'name', className: 'className', description: 'desci', type: 'type'})
        ]);
    });

    it('update experiment algorithm plugins should return 2 plugins for existing plugins', (done) => {
        const experimentAlgorithmPlugins = [
            new ExperimentAlgorithmPlugins({id: 1, algorithmPlugins: [
                new Plugin({name: 'name', className: 'className', description: 'desc', type: 'type'})
            ] 
        })];
        const service = MockExperimentService.init(new ExperimentList(), [], experimentAlgorithmPlugins);
        service.experimentAlgorithmPlugins.subscribe((value) => {
            expect(value.algorithmPlugins.length).toEqual(2);
            done();
        });
        service.updateExperimentAlgorithmPlugins(1, [
            new Plugin({name: 'name', className: 'className', description: 'desci', type: 'type'}),
            new Plugin({name: 'name', className: 'className', description: 'desci', type: 'type'}),
        ]);
    });

    it('update fetch plugins should return 1 plugin', (done) => {
        const service = new MockExperimentService();
        service.fetchPlugins.subscribe((value) => {
            expect(value.length).toEqual(1);
            done();
        });
        service.updateFetchPlugins([
            new Plugin({name: 'name', className: 'className', description: 'desci', type: 'type'})
        ]);
    });


    it('select fetch plugin from experiment should throw for experiment not found', () => {
        const service = new MockExperimentService();
        expect(() => {
            service.selectFetchPlugin(404, new Plugin({name: 'name', className: 'className', description: 'desc', type: 'type'}));
        }).toThrowError();
    });

    it('select fetch plugin from experiment should throw event with experiments but not found', () => {
        const service = MockExperimentService.init(new ExperimentList([
            new ExperimentSelectFetchStage({id: 1}),
            new ExperimentSelectFetchStage({id: 2}),
            new ExperimentSelectFetchStage({id: 3}),
        ]));
        expect(() => {
            service.selectFetchPlugin(404, new Plugin({name: 'name', className: 'className', description: 'desc', type: 'type'}));
        }).toThrowError();
    });

    it('select fetch plugin from experiment shuld move experiment to the next stage', (done) => {
        const service = MockExperimentService.init(new ExperimentList([
            new ExperimentSetupFetchStage({id: 1})
        ]));
        service.experimentsChanged.subscribe((value: ExperimentList) => {
            expect(value.experiments[0].stage).toEqual(ExperimentStages.Setup_Fetch);
            done();
        });
        service.selectFetchPlugin(1, new Plugin({name: 'name', className: 'className', description: 'desc', type: 'type'}));
    });


});

