import { MockExperimentService } from './mock-experiment.service';
import { Experiment, ExperimentList } from '../../../../shared/models';
import { ExperimentStages } from '../../../../shared/models/experiment_stages';

describe('Angular Mock Experiment Service Tests', () => {

    it('all should create service with no experiments', () => {
        const service = new MockExperimentService();
        expect(service.all().experiments.length).toBe(0);
    });

    it('init should create service with experiments', () => {
        const experimentsList = new ExperimentList(
            [
                new Experiment({ id: 1, stage: ExperimentStages.Select_Fetch })
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
                new Experiment({ id: 1, stage: ExperimentStages.Select_Fetch })
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
                new Experiment({ id: 1, stage: ExperimentStages.Select_Fetch }),
                new Experiment({ id: 2, stage: ExperimentStages.Select_Fetch }),
            ]
        );
        const service = MockExperimentService.init(experimentsList);
        expect(() => {
            service.get(404);
        }).toThrowError();
    });


});

