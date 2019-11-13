import { AppDataGroupsProducer } from './app-data-groups.producer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { ErrorEvents, ExperimentsEvents } from '../../../../shared/events';
import { Experiment, ExperimentList } from '../../../../shared/models';
import { DataGroupsProducers } from './data-groups.producer';
import { BaseProducer } from '../base.producer';
import { ExperimentDataGroup, DataGroupSettings } from '../../models';
import { DataGroupViewModel } from '../../../../shared/view-models';
import { MockDataGroupConverter } from '../../converters';

describe('Electron App Experiment Producer Tests', () => {

    let producer: AppDataGroupsProducer;
    let serviceContainer: MockServiceContainer;
    let ipcService: MockIpcService;
    let converter: MockDataGroupConverter;

    beforeEach(() => {
        ipcService = new MockIpcService();
        converter = new MockDataGroupConverter();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.IpcService:
                    return ipcService;
                case SERVICE_TYPES.DataGroupConverter:
                    return converter;
                default:
                    throw new Error(`Couldn't find type.`);
            }
        };

        producer = new AppDataGroupsProducer(serviceContainer);
    });

    it('all should call get all listeners', (done) => {
        ipcService.on(ExperimentsEvents.GetAllDataGroupsListeners, () => {
            expect().nothing();
            done();
        });
        producer.all([], new DataGroupSettings());
    });


    it('delete should call delete listeners', (done) => {
        ipcService.on(ExperimentsEvents.DeleteDataGroupListeners, (event, id) => {
            expect(id).toBe(1);
            done();
        });
        producer.delete(1);
    });


    it('error should call error listeners', (done) => {
        ipcService.on(ErrorEvents.ExceptionListeners, () => {
            expect().nothing();
            done();
        });
        producer.error('error');
    });

});
