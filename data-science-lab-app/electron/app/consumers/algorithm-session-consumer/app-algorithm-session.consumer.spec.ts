import { AppAlgorithmSessionConsumer } from './app-algorithm-session.consumer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { MockAlgorithmSessionOptionsService } from '../../services';
import { ExperimentsEvents } from '../../../../shared/events';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';

describe('Electron App Algorithm Session Consumer Tests', () => {

    let consumer: AppAlgorithmSessionConsumer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;
    let sessionService: MockAlgorithmSessionOptionsService;

    beforeEach(() => {
        sessionService = new MockAlgorithmSessionOptionsService();
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.AlgorithmSessionOptionsService:
                    return sessionService;
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
        consumer = new AppAlgorithmSessionConsumer(serviceContainer);
        consumer.initialize();
    });

    it('get all event should call session service all', (done) => {
        sessionService.all = () => {
            expect().nothing();
            done();
        };
        ipcService.send(ExperimentsEvents.GetAllAlgorithmSessionsEvent);
    });

    it('create event should call session service create', (done) => {
        sessionService.create = (id, plugin) => {
            expect(id).toBeDefined();
            expect(plugin).toBeDefined();
            done();
        };
        ipcService.send(ExperimentsEvents.CreateAlgorithmSessionEvent, 1, new AlgorithmPluginViewModel({
            plugin: {
                name: 'name', className: 'class', packageName: 'package', description: '', type: ''
            }
        }), {});
    });

    it('delete event should call session service delete', (done) => {
        sessionService.delete = (id) => {
            expect(id).toBe(1);
            done();
        };
        ipcService.send(ExperimentsEvents.DeleteAlgorithmSessionEvent, 1);
    });

    it('submit event should call session serivce submit', (done) => {
        sessionService.submitOptions = (id, inputs) => {
            expect(id).toBe(1);
            done();
        };
        ipcService.send(ExperimentsEvents.SubmitOptionsAlgorithmSessionEvent, 1, {});
    });

    it('execute command should call session service execute command', (done) => {
        sessionService.executeCommand = (id, cmd) => {
            expect(id).toBe(1);
            done();
        };
        ipcService.send(ExperimentsEvents.ExecuteCommandAlgorithmSessionEvent, 1, 'cmd');
    });

});

