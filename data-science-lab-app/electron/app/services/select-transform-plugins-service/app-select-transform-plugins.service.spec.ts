import { AppSelectTransformPluginsService } from './app-select-transform-plugins.service';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockSelectTransformPluginsDataService } from '../../data-services';
import { MockSelectTransformPluginsProducer } from '../../producers';
import { PluginPackage, SelectTransformPlugin } from '../../../../shared/models';


describe('Electron App Select Transform Plugins Service Tests', () => {

    let transformPluginsService: AppSelectTransformPluginsService;
    let serviceContainer: MockServiceContainer;
    let dataService: MockSelectTransformPluginsDataService;
    let producer: MockSelectTransformPluginsProducer;

    beforeEach(() => {
        serviceContainer = new MockServiceContainer();
        dataService = new MockSelectTransformPluginsDataService();
        producer = new MockSelectTransformPluginsProducer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.SelectTransformPluginsDataService:
                    return dataService;
                case SERVICE_TYPES.SelectTransformPluginsProducer:
                    return producer;
                default:
                    throw new Error(`Not implemented error.`);
            }
        };
        transformPluginsService = new AppSelectTransformPluginsService(serviceContainer);
    });

    it('all should call producer', (done) => {
        dataService.all = () => {
            return [];
        };
        producer.all = () => {
            expect().nothing();
            done();
        };
        transformPluginsService.all();
    });

    it('all should call producer all on callback', (done) => {
        dataService.all = (callback) => {
            callback([]);
            return [];
        };
        producer.all = () => {
            expect().nothing();
            done();
        };
        transformPluginsService.all();
    });

    it('all should call producer error on error', (done) => {
        dataService.all = (callback, error) => {
            error('error');
            return [];
        };
        producer.error = () => {
            expect().nothing();
            done();
        };
        transformPluginsService.all();
    });


    it('install should call producer all', (done) => {
        dataService.install = (_) => new Promise<SelectTransformPlugin[]>((resolve, reject) => {
            resolve([]);
        });
        producer.all = () => {
            expect().nothing();
            done();
        };
        transformPluginsService.install(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });
    
    
    it('install should call producer error', (done) => {
        dataService.install = (_) => new Promise<SelectTransformPlugin[]>((resolve, reject) => {
            reject('error');
        });
        producer.error = () => {
            expect().nothing();
            done();
        };
        transformPluginsService.install(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });


    it('uninstall should call producer all', (done) => {
        dataService.uninstall = (_) => new Promise<SelectTransformPlugin[]>((resolve, reject) => {
            resolve([]);
        });
        producer.all = () => {
            expect().nothing();
            done();
        };
        transformPluginsService.uninstall(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });
    
    
    it('uninstall should call producer error', (done) => {
        dataService.uninstall = (_) => new Promise<SelectTransformPlugin[]>((resolve, reject) => {
            reject('error');
        });
        producer.error = () => {
            expect().nothing();
            done();
        };
        transformPluginsService.uninstall(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });


});


