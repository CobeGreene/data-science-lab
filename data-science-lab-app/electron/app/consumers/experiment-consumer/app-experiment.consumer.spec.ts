import { AppExperimentConsumer } from './app-experiment.consumer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { MockExperimentService } from '../../services';
import { ExperimentsEvents } from '../../../../shared/events';

describe('Electron App Experiment Consumer Tests', () => {
    let consumer: AppExperimentConsumer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;
    let experimentService: MockExperimentService;

    beforeEach(() => {
        experimentService = new MockExperimentService();
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.ExperimentService:
                    return experimentService;
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
        consumer = new AppExperimentConsumer(serviceContainer);
        consumer.initialize();
    });

    it('get all event should call experiment service all', (done) => {
        experimentService.all = () => {
            expect().nothing();
            done();
        };
        ipcService.send(ExperimentsEvents.GetAllEvent);
    });

    it('create event should call experiment service create', (done) => {
        experimentService.create = () => {
            expect().nothing();
            done();
        };
        ipcService.send(ExperimentsEvents.CreateEvent);
    });

});

