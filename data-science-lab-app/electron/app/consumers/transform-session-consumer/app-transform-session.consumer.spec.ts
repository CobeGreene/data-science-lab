import { AppTransformSessionConsumer } from './app-transform-session.consumer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { MockTransformService } from '../../services';
import { ExperimentsEvents } from '../../../../shared/events';
import { SelectTransformPlugin } from '../../../../shared/models';

describe('Electron App Transform Session Consumer Tests', () => {

    let consumer: AppTransformSessionConsumer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;
    let sessionService: MockTransformService;

    beforeEach(() => {
        sessionService = new MockTransformService();
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.TransformService:
                    return sessionService;
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
        consumer = new AppTransformSessionConsumer(serviceContainer);
        consumer.initialize();
    });

    it('get all event should call session service all', (done) => {
        sessionService.all = () => {
            expect().nothing();
            done();
        };
        ipcService.send(ExperimentsEvents.GetAllTransformSessionsEvent);
    });

    it('create event should call session service create', (done) => {
        sessionService.create = (id, plugin) => {
            expect(id).toBeDefined();
            expect(plugin).toBeDefined();
            done();
        };
        ipcService.send(ExperimentsEvents.CreateTransformSessionEvent, 1, new SelectTransformPlugin({
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
        ipcService.send(ExperimentsEvents.DeleteTransformSessionEvent, 1);
    });

    it('submit event should call session serivce submit', (done) => {
        sessionService.submitOptions = (id, inputs) => {
            expect(id).toBe(1);
            done();
        };
        ipcService.send(ExperimentsEvents.SubmitOptionsTransformSessionEvent, 1, {});
    });

    it('execute command should call session service execute command', (done) => {
        sessionService.executeCommand = (id, cmd) => {
            expect(id).toBe(1);
            done();
        };
        ipcService.send(ExperimentsEvents.ExecuteCommandFetchSessionEvent, 1, 'cmd');
    });

});

