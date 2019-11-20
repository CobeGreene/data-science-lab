import { BaseProducer } from '../base.producer';
import { AppSelectTransformPluginsProducer } from './app-select-transform-plugins.producer';
import { SelectTransformPlugin } from '../../../../shared/models';
import { SERVICE_TYPES, MockServiceContainer } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';
import { IpcService, MockIpcService } from '../../../../shared/services';



describe('Electron App Select Transform Plugins Producer Tests', () => {

    let producer: AppSelectTransformPluginsProducer;
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

        producer = new AppSelectTransformPluginsProducer(serviceContainer); 
    });

    it('all should call get all listeners', (done) => {
        ipcService.on(ExperimentsEvents.GetAllTransformPluginsListeners, () => {
            expect().nothing();
            done();
        });
        producer.all([]);
    });

});

