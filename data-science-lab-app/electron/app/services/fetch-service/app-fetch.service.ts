import { Plugin } from '../../../../shared/models';
import { FetchService } from './fetch.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { FetchSessionService } from '../../session-services';
import { FetchSessionProducer } from '../../producers';
import { PackageDataService, ExperimentDataGroupDataService } from '../../data-services';
import { FetchSession } from '../../models';
import { FetchPluginDataConverter } from '../../converters/fetch-plugin-data-converter';

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

    async executeCommand(experimentId: number, command: string) {
        const fetchSessionService = this.serviceContainer.resolve<FetchSessionService>(SERVICE_TYPES.FetchSessionService);
        const session = fetchSessionService.read(experimentId);
        const fetchSessionProducer = this.serviceContainer.resolve<FetchSessionProducer>(SERVICE_TYPES.FetchSessionProducer);
        const options = session.fetchPlugin.getOptions();
        try {
            await options.executeCommand(command);
            if (options.noMore()) {
                this.sessionFinish(session);
            } else {
                fetchSessionProducer.updateSession(session);
            }
        } catch (reason) {
            fetchSessionProducer.error(reason);
        }
    }
    submitOptions(experimentId: number, inputs: { [id: string]: any; }): void {
        const fetchSessionService = this.serviceContainer.resolve<FetchSessionService>(SERVICE_TYPES.FetchSessionService);
        const session = fetchSessionService.read(experimentId);
        const fetchSessionProducer = this.serviceContainer.resolve<FetchSessionProducer>(SERVICE_TYPES.FetchSessionProducer);
        const options = session.fetchPlugin.getOptions();
        options.submit(inputs);
        if (options.noMore()) {
            this.sessionFinish(session);
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

    private sessionFinish(session: FetchSession) {
        const fetchPluginData = session.fetchPlugin.fetch();
        const converter = this.serviceContainer.resolve<FetchPluginDataConverter>(SERVICE_TYPES.FetchPluginDataConverter);
        const dataGroups = converter.toDataGroups(fetchPluginData);
        const dataGroupDataService = this.serviceContainer
            .resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);

        for (const group of dataGroups) {
            group.experimentId = session.experimentId;
            dataGroupDataService.create(group);
        }
        const fetchSessionService = this.serviceContainer.resolve<FetchSessionService>(SERVICE_TYPES.FetchSessionService);
        const expermentId = session.experimentId;
        fetchSessionService.delete(expermentId);
        const fetchSessionProducer = this.serviceContainer.resolve<FetchSessionProducer>(SERVICE_TYPES.FetchSessionProducer);
        fetchSessionProducer.finish(expermentId);
    }


}

