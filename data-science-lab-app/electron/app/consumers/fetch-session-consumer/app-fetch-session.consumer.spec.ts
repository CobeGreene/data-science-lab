import { AppFetchSessionConsumer } from './app-fetch-session.consumer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { MockFetchService } from '../../services';
import { ExperimentsEvents } from '../../../../shared/events';
import { Plugin } from '../../../../shared/models';


describe('Electron App Fetch Session Consumer Tests', () => {

    let consumer: AppFetchSessionConsumer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;
    let sessionService: MockFetchService;

    beforeEach(() => {
        sessionService = new MockFetchService();
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.FetchService:
                    return sessionService;
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };
        consumer = new AppFetchSessionConsumer(serviceContainer);
        consumer.initialize();
    });    

    it('get all event should call session service all', (done) => {
        sessionService.all = () => {
            expect().nothing();
            done();
        };
        ipcService.send(ExperimentsEvents.GetAllFetchSessionsEvent);
    });

    it('create event should call session service create', (done) => {
        sessionService.create = (id, plugin) => {
            expect(id).toBeDefined();
            expect(plugin).toBeDefined();
            done();
        };
        ipcService.send(ExperimentsEvents.CreateFetchSessionEvent, 1, new Plugin({
            name: 'name', className: 'class', packageName: 'package', description: '', type: ''
        }));
    });

});

