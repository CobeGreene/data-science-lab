import { AppFetchPluginsProducer } from './app-fetch-plugins.producer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

describe('Electron App Fetch Plugins Producer Tests', () => {

    let producer: AppFetchPluginsProducer;
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
        producer = new AppFetchPluginsProducer(serviceContainer);
    });    

    it('all should call all listeners', (done) => {
        ipcService.on(ExperimentsEvents.GetAllFetchPluginsListeners, () => {
            expect().nothing();
            done();
        });
        producer.all([]);
    });

});
