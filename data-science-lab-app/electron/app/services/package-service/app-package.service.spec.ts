import { AppPackageService } from './app-package.service';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockPackageDataService } from '../../data-services';
import { MockPackageProducer } from '../../producers';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';

describe('Electron App Package Service Tests', () => {
    let packageService: AppPackageService;
    let serviceContainer: MockServiceContainer;
    let dataService: MockPackageDataService;
    let producer: MockPackageProducer;

    beforeEach(() => {
        serviceContainer = new MockServiceContainer();
        dataService = new MockPackageDataService();
        producer = new MockPackageProducer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.PackageDataService:
                    return dataService;
                case SERVICE_TYPES.PackageProducer:
                    return producer;
                default:
                    throw new Error(`Not implemented error.`);
            }
        };
        packageService = new AppPackageService(serviceContainer);
    });

    it('all should call producer', (done) => {
        dataService.all = () => {
            return new PluginPackageList();
        };
        producer.all = () => {
            expect().nothing();
            done();
        };
        packageService.all();
    });

    it('all should call error producer when calling error', (done) => {
        producer.error = () => {
            expect().nothing();
            done();
        };
        dataService.all = (_, error) => {
            error('error');
            return new PluginPackageList();
        };
        packageService.all();
    });

    it('install should call producer install', (done) => {
        dataService.install = (_) => new Promise<void>((resolve, reject) => {
            resolve();
        });
        producer.install = () => {
            expect().nothing();
            done();
        };
        packageService.install(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });

    it('install should call producer error with fail', (done) => {
        dataService.install = (_) => new Promise<void>((resolve, reject) => {
            reject();
        });
        producer.error = () => {
            expect().nothing();
            done();
        };
        packageService.install(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });

    it('uninstall should call producer uninstall', (done) => {
        dataService.uninstall = (_) => new Promise<void>((resolve, reject) => {
            resolve();
        });
        producer.uninstall = () => {
            expect().nothing();
            done();
        };
        packageService.uninstall(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });
    
    it('uninstall should call producer error with failed', (done) => {
        dataService.uninstall = (_) => new Promise<void>((resolve, reject) => {
            reject();
        });
        producer.error = () => {
            expect().nothing();
            done();
        };
        packageService.uninstall(new PluginPackage({
            name: 'name', repositoryName: 'repo', username: 'user',
            owner: 'owner'
        }));
    });



});
