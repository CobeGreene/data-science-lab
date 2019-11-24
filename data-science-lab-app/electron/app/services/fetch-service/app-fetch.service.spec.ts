import { Plugin, PluginPackage } from '../../../../shared/models';
import { FetchService } from './fetch.service';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockFetchSessionService } from '../../session-services';
import { MockFetchSessionProducer } from '../../producers';
import { MockPackageDataService } from '../../data-services';
import { AppFetchService } from './app-fetch.service';
import { FetchSession } from '../../models';


describe('Electron App Fetch Service Tests', () => {

    let fetchService: AppFetchService;
    let serviceContainer: MockServiceContainer;
    let sessionService: MockFetchSessionService;
    let packageDataService: MockPackageDataService;
    let producer: MockFetchSessionProducer;

    beforeEach(() => {
        serviceContainer = new MockServiceContainer();
        sessionService = new MockFetchSessionService();
        producer = new MockFetchSessionProducer();
        packageDataService = new MockPackageDataService();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.PackageDataService:
                    return packageDataService;
                case SERVICE_TYPES.FetchSessionProducer:
                    return producer;
                case SERVICE_TYPES.FetchSessionService:
                    return sessionService;
                default:
                    throw new Error(`Not implemented error.`);
            }
        };
        fetchService = new AppFetchService(serviceContainer);
    });

    it('all should output all the sessions from session sevice', (done) => {
        producer.all = ((_) => {
            expect().nothing();
            done();
        });
        sessionService.all = () => {
            return [];
        };

        fetchService.all();
    });

    it('create should produce error of package service cant find', (done) => {
        producer.error = (() => {
            expect().nothing();
            done();
        });
        packageDataService.find = (() => {
            return undefined;
        });
        fetchService.create(1, new Plugin({
            name: 'name', className: 'className',
            description: 'desc', type: 'type'
        }));
    });

    it('create should produce error if session service fails to create', (done) => {
        producer.error = (() => {
            expect().nothing();
            done();
        });
        packageDataService.find = (() => {
            return null;
        });
        sessionService.create = (() => {
            return new Promise((resolve, reject) => {
                reject();
            });
        });
        fetchService.create(1, new Plugin({
            name: 'name', className: 'className',
            description: 'desc', type: 'type'
        }));
    });
    
    class MyOptions {
        noMore() { return false; }
    }
    class MyFetchPlugin {
        getOptions() { return new MyOptions(); }
    }

    it('create should producer all for successful call', (done) => {
        producer.all = (() => {
            expect().nothing();
            done();
        });
        packageDataService.find = (() => {
            return (new Object() as unknown) as PluginPackage;
        });
        sessionService.create = (() => {
            return new Promise((resolve, reject) => {
                const obj = new Object();
                obj['fetchPlugin'] = new MyFetchPlugin();
                resolve(obj as FetchSession);
            });
        });
        fetchService.create(1, new Plugin({
            name: 'name', className: 'className',
            description: 'desc', type: 'type'
        }));
    });


    it('create should producer new session for successful call', (done) => {
        producer.newSession = (() => {
            expect().nothing();
            done();
        });
        packageDataService.find = (() => {
            return (new Object() as unknown) as PluginPackage;
        });
        sessionService.create = (() => {
            return new Promise((resolve, reject) => {
                const obj = new Object();
                obj['fetchPlugin'] = new MyFetchPlugin();
                resolve(obj as FetchSession);
            });
        });
        fetchService.create(1, new Plugin({
            name: 'name', className: 'className',
            description: 'desc', type: 'type'
        }));
    });

    it('delete should tell producer to delete', (done) => {
        producer.delete = (() => {
            expect().nothing();
            done();
        });

        sessionService.delete = () => {};
        fetchService.delete(1);
    });

    it('delete should tell producer to send all message', (done) => {
        producer.all = (() => {
            expect().nothing();
            done();
        });

        sessionService.delete = () => {};
        fetchService.delete(1);
    });

});

