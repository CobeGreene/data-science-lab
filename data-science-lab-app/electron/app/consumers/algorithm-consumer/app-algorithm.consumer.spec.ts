import { SERVICE_TYPES, MockServiceContainer } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockAlgorithmService } from '../../services';
import { AppAlgorithmConsumer } from './app-algorithm.consumer';


describe('Electron App Algorithm Consumer Tests', () => {

    let consumer: AppAlgorithmConsumer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;
    let algorithmService: MockAlgorithmService;

    beforeEach(() => {
        algorithmService = new MockAlgorithmService();
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                case SERVICE_TYPES.AlgorithmService:
                    return algorithmService;
                default:
                    throw new Error(`Couldn't find type`);
            }
        };
        consumer = new AppAlgorithmConsumer(serviceContainer);
        consumer.initialize();
    });

    it('all event should call service all', (done) => {
        algorithmService.all = () => {
            expect().nothing();
            done();
        };

        ipcService.send(ExperimentsEvents.GetAllAlgorithmsEvent);
    });

    it('delete event should call service delete', (done) => {
        algorithmService.delete = (id) => {
            expect(id).toBe(1);
            done();
        };
        ipcService.send(ExperimentsEvents.DeleteAlgorithmEvent, 1);
    });

    it('start event should call service delete', (done) => {
        algorithmService.start = (id) => {
            expect(id).toBe(1);
            done();
        };
        ipcService.send(ExperimentsEvents.StartAlgorithmEvent, 1);
    });

    it('stop event should call service delete', (done) => {
        algorithmService.stop = (id) => {
            expect(id).toBe(1);
            done();
        };
        ipcService.send(ExperimentsEvents.StopAlgorithmEvent, 1);
    });



});

