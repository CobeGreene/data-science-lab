import { AppExperimentDataService } from './app-experiment-data.service';
import { ExperimentData } from '../../models';
import { ExperimentStages } from '../../../../shared/models';

describe('Electron App Experiment Data Service Tests', () => {

    let experimentService: AppExperimentDataService;

    beforeEach(() => {
        experimentService = new AppExperimentDataService();
    });

    it('all should return empty list', () => {
        const data = experimentService.all();
        expect(data.length).toEqual(0);
    });

    it('create should create with id one', () => {
        const data = experimentService.create();
        expect(data.id).toBe(1);
        expect(data.stage).toEqual(ExperimentStages.Select_Fetch);
    });

    it('create should add one to the list', () => {
        experimentService.create();
        expect(experimentService.all().length).toBe(1);
    });

    it('get should return null for not found data', () => {
        expect(experimentService.get(404)).toBeNull();
    });

    it('delete should throw for not found', () => {
        expect(() => {
            expect(experimentService.delete(404));
        }).toThrowError();
    });
    
    it('delete should decrement list', () => {
        const data = experimentService.create();
        experimentService.delete(data.id);
        expect(experimentService.all().length).toBe(0);
    });

    it('update should change experiment list', () => {
        const data = experimentService.create();
        data.stage = ExperimentStages.Test_Algorithm;
        expect(experimentService.get(data.id).stage).toEqual(ExperimentStages.Test_Algorithm);
    });

});

