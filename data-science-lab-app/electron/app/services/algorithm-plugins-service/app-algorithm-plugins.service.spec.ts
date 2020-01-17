import { AppAlgorithmPluginsService } from './app-algorithm-plugins.service';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockAlgorithmPluginsDataService } from '../../data-services';
import { MockAlgorithmPluginsProducer } from '../../producers';
import { PluginPackage } from '../../../../shared/models';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';


describe('Electron App Algorithm Plugins Service Tests', () => {

    let service: AppAlgorithmPluginsService;
    let serviceContainer: MockServiceContainer;
    let dataService: MockAlgorithmPluginsDataService;
    let producer: MockAlgorithmPluginsProducer;

    beforeEach(() => {
        serviceContainer = new MockServiceContainer();
        dataService = new MockAlgorithmPluginsDataService();
        producer = new MockAlgorithmPluginsProducer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.AlgorithmPluginsDataService:
                    return dataService;
                case SERVICE_TYPES.AlgorithmPluginsProducer:
                    return producer;
                default:
                    throw new Error(`Not implemented error.`);
            }
        };
        service = new AppAlgorithmPluginsService(serviceContainer);
    });

    it('all should call producer', (done) => {
        dataService.all = () => {
            return [];
        };
        producer.all = () => {
            expect().nothing();
            done();
        };
        service.all();
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
        service.all();
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
        service.all();
    });


    it('install should call producer all', (done) => {
        dataService.install = (_) => new Promise<AlgorithmPluginViewModel[]>((resolve, reject) => {
            resolve([]);
        });
        producer.all = () => {
            expect().nothing();
            done();
        };
        service.install(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });
    
    
    it('install should call producer error', (done) => {
        dataService.install = (_) => new Promise<AlgorithmPluginViewModel[]>((resolve, reject) => {
            reject('error');
        });
        producer.error = () => {
            expect().nothing();
            done();
        };
        service.install(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });


    it('uninstall should call producer all', (done) => {
        dataService.uninstall = (_) => new Promise<AlgorithmPluginViewModel[]>((resolve, reject) => {
            resolve([]);
        });
        producer.all = () => {
            expect().nothing();
            done();
        };
        service.uninstall(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });
    
    
    it('uninstall should call producer error', (done) => {
        dataService.uninstall = (_) => new Promise<AlgorithmPluginViewModel[]>((resolve, reject) => {
            reject('error');
        });
        producer.error = () => {
            expect().nothing();
            done();
        };
        service.uninstall(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });


});


