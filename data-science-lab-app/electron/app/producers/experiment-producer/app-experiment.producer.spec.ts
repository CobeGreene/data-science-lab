import { AppExperimentProducer } from './app-experiment.producer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { ErrorEvents, ExperimentsEvents } from '../../../../shared/events';
import { Experiment, ExperimentList } from '../../../../shared/models';


describe('Electron App Experiment Producer Tests', () => {

    let producer: AppExperimentProducer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;

    beforeEach(() => {
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };

        producer = new AppExperimentProducer(serviceContainer);
    });

    it('all should call get all listeners', (done) => {
        ipcService.on(ExperimentsEvents.GetAllListeners, () => {
            expect().nothing();
            done();
        });
        producer.all(new ExperimentList());
    });


    it('create should call create listeners', (done) => {
        ipcService.on(ExperimentsEvents.CreateListeners, () => {
            expect().nothing();
            done();
        });
        producer.newExperiment(new Experiment({
            id: 1
        }));
    });


    it('error should call error listeners', (done) => {
        ipcService.on(ErrorEvents.ExceptionListeners, () => {
            expect().nothing();
            done();
        });
        producer.error('error');
    });

});
