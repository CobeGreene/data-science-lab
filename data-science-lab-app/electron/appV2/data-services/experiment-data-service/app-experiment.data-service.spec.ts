import { AppExperimentDataService } from './app-experiment.data-service';
import { Experiment, ExperimentStages } from '../../models';

describe('Electron App Experiment Data Service Tests', () => {
    let experimentDataService: AppExperimentDataService;

    beforeEach(() => {
        experimentDataService = new AppExperimentDataService();
    });

    it('all should return empty list', () => {
        const experiments = experimentDataService.all();
        expect(experiments.length).toEqual(0);
    });

    it('create should create with id one', () => {
        const experiment = experimentDataService.create(new Experiment({
            stage: ExperimentStages.Select_Fetch
        }));
        expect(experiment.id).toBe(1);
        expect(experiment.stage).toEqual(ExperimentStages.Select_Fetch);
    });


    it('create should add one to the list', () => {
        experimentDataService.create(new Experiment({}));
        expect(experimentDataService.all().length).toBe(1);
    });

    it('create twice should create experiment with id of 2', () => {
        experimentDataService.create(new Experiment({}));
        experimentDataService.create(new Experiment({}));
        expect(experimentDataService.read(2).id).toBe(2);
    });

    it('read should throw for experiment not found', () => {
        expect(() => {
            experimentDataService.read(404);
        }).toThrowError();
    });

    it('delete should throw for not found', () => {
        expect(() => {
            expect(experimentDataService.delete(404));
        }).toThrowError();
    });
    
    it('delete should decrement list', () => {
        const experiment = experimentDataService.create(new Experiment({}));
        experimentDataService.delete(experiment.id);
        expect(experimentDataService.all().length).toBe(0);
    });

    it('update should change experiment list', () => {
        const experiment = experimentDataService.create(new Experiment({}));
        experiment.stage = ExperimentStages.Test_Algorithm;
        experimentDataService.update(experiment);
        expect(experimentDataService.read(experiment.id).stage).toEqual(ExperimentStages.Test_Algorithm);
    });
});
