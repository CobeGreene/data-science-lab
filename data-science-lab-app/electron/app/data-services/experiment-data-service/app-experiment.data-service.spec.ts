import { AppExperimentDataService } from './app-experiment.data-service';
import { Experiment } from '../../../../shared/models';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockDocumentContext } from '../../contexts';

describe('Electron App Experiment Data Service Tests', () => {
    let experimentDataService: AppExperimentDataService;
    let serviceContainer: MockServiceContainer;

    beforeEach(() => {
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type) => {
            switch (type) {
                case SERVICE_TYPES.DocumentContext:
                    return new MockDocumentContext();
                default: 
                    throw new Error(`Can't find type ${type}`);
            }
        };
        experimentDataService = new AppExperimentDataService(serviceContainer);
    });

    it('all should return empty list', () => {
        const experimentList = experimentDataService.all();
        expect(experimentList.experiments.length).toEqual(0);
    });

    it('create should create with id one', () => {
        const experiment = experimentDataService.create(new Experiment({
        }));
        expect(experiment.id).toBe(1);
    });


    it('create should add one to the list', () => {
        experimentDataService.create(new Experiment({}));
        expect(experimentDataService.all().experiments.length).toBe(1);
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
        expect(experimentDataService.all().experiments.length).toBe(0);
    });

    it('update should change experiment list', () => {
        const experiment = experimentDataService.create(new Experiment({}));
        const date = new Date();
        experiment.dateCreated = date;
        experimentDataService.update(experiment);
        expect(experimentDataService.read(experiment.id).dateCreated).toEqual(date);
    });
});
