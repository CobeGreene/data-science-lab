import { AppFetchPluginsService } from './app-fetch-plugins.service';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';
import { MockPackageDataService } from '../../data-services';
import { MockFetchPluginsProducer } from '../../producers';
import { Plugin, PluginPackageList, PluginPackage } from '../../../../shared/models';
import { PluginTypes } from 'data-science-lab-core';

describe('Electron App Fetch Plugins Service Tests', () => {

    let service: AppFetchPluginsService;
    let dataService: MockPackageDataService;
    let producer: MockFetchPluginsProducer;
    let pluginPackageList: PluginPackageList;
    let serviceContainer: MockServiceContainer;


    beforeEach(() => {
        serviceContainer = new MockServiceContainer();
        dataService = new MockPackageDataService();
        producer = new MockFetchPluginsProducer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.PackageDataService:
                    return dataService;
                case SERVICE_TYPES.FetchPluginsProducer:
                    return producer;
                default:
                    throw new Error(`Not implemented error.`);
            }
        };
        pluginPackageList = new PluginPackageList([
            new PluginPackage({
                name: 'name',
                owner: 'owner',
                repositoryName: 'repo',
                username: 'username',
                plugins: [
                    new Plugin({
                        name: 'name', className: 'className',
                        description: ' ', type: PluginTypes.Fetch
                    })
                ],
                install: true,
            }),
            new PluginPackage({
                name: 'name',
                owner: 'owner',
                repositoryName: 'repo',
                username: 'username',
                plugins: [
                    new Plugin({
                        name: 'name', className: 'className',
                        description: ' ', type: PluginTypes.Fetch
                    })
                ],
                install: false,
            })
        ]);
        service = new AppFetchPluginsService(serviceContainer);
    });

    it('all should call producer with 1 fetch plugin', (done) => {
        dataService.all = () => {
            return pluginPackageList;
        };  

        producer.all = (list) => {
            expect(list.length).toBe(1);
            done();
        };
        service.all();
    });

});

