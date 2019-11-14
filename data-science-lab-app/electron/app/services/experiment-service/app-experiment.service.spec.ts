import { AppExperimentService } from './app-experiment.service';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockExperimentDataService } from '../../data-services';
import { MockExperimentProducer } from '../../producers';
import { Experiment, ExperimentList } from '../../../../shared/models';


describe('Electron App Experiment Service Tests', () => {

    let experimentService: AppExperimentService;
    let serviceContainer: MockServiceContainer;
    let dataService: MockExperimentDataService;
    let producer: MockExperimentProducer;

    beforeEach(() => {
        serviceContainer = new MockServiceContainer();
        dataService = new MockExperimentDataService();
        producer = new MockExperimentProducer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.ExperimentDataService:
                    return dataService;
                case SERVICE_TYPES.ExperimentProducer:
                    return producer;
                default:
                    throw new Error(`Not implemented error.`);
            }
        };
        experimentService = new AppExperimentService(serviceContainer);
    });

    it('all should call all on producer', (done) => {
        dataService.all = () => {
            return new ExperimentList([]);
        };

        producer.all = () => {
            expect().nothing();
            done();
        };
        experimentService.all();
    });

    it('create should call new experiment on producer', (done) => {
        dataService.create = () => {
            return new Experiment({});
        };
        dataService.all = () => {
            return new ExperimentList([]);
        };
        producer.newExperiment = () => {
            expect().nothing();
            done();
        };
        experimentService.create();
    });

    it('create should call all on producer', (done) => {
        dataService.create = () => {
            return new Experiment({});
        };
        dataService.all = () => {
            return new ExperimentList([]);
        };
        producer.all = () => {
            expect().nothing();
            done();
        };
        experimentService.create();
    });

});

