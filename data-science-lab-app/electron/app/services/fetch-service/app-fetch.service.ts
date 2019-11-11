import { Plugin } from '../../../../shared/models';
import { FetchService } from './fetch.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { FetchSessionService } from '../../session-services';
import { FetchSessionProducer } from '../../producers';
import { PackageDataService } from '../../data-services';

export class AppFetchService implements FetchService {

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): void {
        const fetchSessionService = this.serviceContainer.resolve<FetchSessionService>(SERVICE_TYPES.FetchSessionService);
        const fetchSessionProducer = this.serviceContainer.resolve<FetchSessionProducer>(SERVICE_TYPES.FetchSessionProducer);
        fetchSessionProducer.all(fetchSessionService.all());
    }

    create(experimentId: number, plugin: Plugin) {
        const packageDataService = this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        const pluginPackage = packageDataService.find(plugin);
        if (!pluginPackage) {
            const fetchSessionProducer = this.serviceContainer.resolve<FetchSessionProducer>(SERVICE_TYPES.FetchSessionProducer);
            fetchSessionProducer.error(
                new Error(`Unable to find plugin package with plugin named: ${plugin.name} and package name ${plugin.packageName}`));
        } else {
            const fetchSessionService = this.serviceContainer.resolve<FetchSessionService>(SERVICE_TYPES.FetchSessionService);
            fetchSessionService.create(experimentId, pluginPackage, plugin)
                .then((session) => {
                    const fetchSessionProducer = this.serviceContainer.resolve<FetchSessionProducer>(SERVICE_TYPES.FetchSessionProducer);
                    fetchSessionProducer.all(fetchSessionService.all());
                    fetchSessionProducer.newSession(session);
                }).catch((reason) => {
                    const fetchSessionProducer = this.serviceContainer.resolve<FetchSessionProducer>(SERVICE_TYPES.FetchSessionProducer);
                    fetchSessionProducer.error(reason);
                });
        }
    }

    executeCommand(experimentId: number, command: string) {
        const fetchSessionService = this.serviceContainer.resolve<FetchSessionService>(SERVICE_TYPES.FetchSessionService);
        const session = fetchSessionService.read(experimentId);
        const fetchSessionProducer = this.serviceContainer.resolve<FetchSessionProducer>(SERVICE_TYPES.FetchSessionProducer);
        const options = session.fetchPlugin.getOptions();
        options.executeCommand(command)
            .then(() => {
                if (options.noMore()) {
                    // TODO Fetching
                } else {
                    fetchSessionProducer.updateSession(session);
                }
            })
            .catch(fetchSessionProducer.error);
    }
    submitOptions(experimentId: number, inputs: { [id: string]: any; }): void {
        const fetchSessionService = this.serviceContainer.resolve<FetchSessionService>(SERVICE_TYPES.FetchSessionService);
        const session = fetchSessionService.read(experimentId);
        const fetchSessionProducer = this.serviceContainer.resolve<FetchSessionProducer>(SERVICE_TYPES.FetchSessionProducer);
        const options = session.fetchPlugin.getOptions(); 
        options.submit(inputs);
        if (options.noMore()) {
            // TODO Fetching.
        } else {
            fetchSessionProducer.updateSession(session);
        }
    }
    delete(experimentId: number) {
        const fetchSessionService = this.serviceContainer.resolve<FetchSessionService>(SERVICE_TYPES.FetchSessionService);
        fetchSessionService.delete(experimentId);  
        const fetchSessionProducer = this.serviceContainer.resolve<FetchSessionProducer>(SERVICE_TYPES.FetchSessionProducer);
        fetchSessionProducer.delete(experimentId);
        fetchSessionProducer.all(fetchSessionService.all());
    }


}

