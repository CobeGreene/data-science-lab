import { AppFetchSessionProducer } from './app-fetch-session.producer';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockIpcService } from '../../../../shared/services';
import { ErrorEvents, ExperimentsEvents } from '../../../../shared/events';
import { FetchSession } from '../../models';
import { FetchPlugin, OptionList } from 'data-science-lab-core';
import { FetchSessionViewModel } from '../../../../shared/view-models';

describe('Electron App Fetch Session Producer Tests', () => {

    class MockOptions {
        options() {
            return null;
        }
    }
    class MockFetch {
        getOptions() {
            const option = new MockOptions();
            return (option as unknown) as OptionList;
        }
    }


    let producer: AppFetchSessionProducer;
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

        producer = new AppFetchSessionProducer(serviceContainer);
    });

    it('all should convert the sessions to view models', (done) => {
        const fetch = new MockFetch();
        const fetchSessions = [
            new FetchSession({
                experimentId: 1,
                plugin: null,
                pluginPackage: null,
                fetchPlugin: (fetch as unknown) as FetchPlugin
            })
        ];
        ipcService.on(ExperimentsEvents.GetAllFetchSessionsListeners, (args) => {
            expect(args).toBeDefined();
            done();
        });
        producer.all(fetchSessions);
    });

    it('new session should convert it to view model', (done) => {
        const fetch = new MockFetch();
        const fetchSession =
            new FetchSession({
                experimentId: 1,
                plugin: null,
                pluginPackage: null,
                fetchPlugin: (fetch as unknown) as FetchPlugin
            });
        ipcService.on(ExperimentsEvents.CreateFetchSessionListeners, (event, arg: FetchSessionViewModel) => {
            expect(arg).toBeDefined();
            done();
        });
        producer.newSession(fetchSession);
    });
    
    
    it('update session should convert it to view model', (done) => {
        const fetch = new MockFetch();
        const fetchSession =
            new FetchSession({
                experimentId: 1,
                plugin: null,
                pluginPackage: null,
                fetchPlugin: (fetch as unknown) as FetchPlugin
            });
        ipcService.on(ExperimentsEvents.UpdatedFetchSessionListeners, (event, arg: FetchSessionViewModel) => {
            expect(arg).toBeDefined();
            done();
        });
        producer.updateSession(fetchSession);
    });

    it('delete should send id', (done) => {
        ipcService.on(ExperimentsEvents.DeleteFetchSessionListeners, (event, arg: number) => {
            expect(arg).toBe(1);
            done();
        });
        producer.delete(1);
    });

    it('finish should send id', (done) => {
        ipcService.on(ExperimentsEvents.FinishedFetchSessionListeners, (event, arg: number) => {
            expect(arg).toBe(1);
            done();
        });
        producer.finish(1);
    });


    it('error should call error listeners', (done) => {
        ipcService.on(ErrorEvents.ExceptionListeners, () => {
            expect().nothing();
            done();
        });
        producer.error('error');
    });    

});
