import { SERVICE_TYPES, MockServiceContainer } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockDataGroupsService } from '../../services';
import { AppDataGroupsConsumer } from './app-data-groups.consumer';


describe('Electron App Data Groups Consumer Tests', () => {

    let consumer: AppDataGroupsConsumer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;
    let dataGroupsService: MockDataGroupsService;

    beforeEach(() => {
        dataGroupsService = new MockDataGroupsService();
        ipcService = new MockIpcService();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                case SERVICE_TYPES.DataGroupsService:
                    return dataGroupsService;
                default:
                    throw new Error(`Couldn't find type`);
            }
        };
        consumer = new AppDataGroupsConsumer(serviceContainer);
        consumer.initialize();
    });

    it('all event should call service all', (done) => {
        dataGroupsService.all = () => {
            expect().nothing();
            done();
        };

        ipcService.send(ExperimentsEvents.GetAllDataGroupsEvent);
    });

    it('delete event should call service delete', (done) => {
        dataGroupsService.delete = (id) => {
            expect(id).toBe(1);
            done();
        };
        ipcService.send(ExperimentsEvents.DeleteDataGroupEvent, 1);
    });

});

