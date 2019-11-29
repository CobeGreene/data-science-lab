import { AlgorithmPluginViewModel } from '../../../../shared/view-models';
import { AlgorithmSessionOptionsService } from './algorithm-session-options.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { AlgorithmSessionService } from '../../session-services';
import { AlgorithmSessionProducer, AlgorithmUpdateProducer } from '../../producers';
import { PackageDataService, ExperimentDataGroupDataService, ExperimentAlgorithmDataService } from '../../data-services';
import { AlgorithmSession, ExperimentAlgorithm } from '../../models';

export class AppAlgorithmSessionOptionsService implements AlgorithmSessionOptionsService {

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): void {
        const sessionService = this.serviceContainer.resolve<AlgorithmSessionService>(SERVICE_TYPES.AlgorithmSessionService);
        const producer = this.serviceContainer.resolve<AlgorithmSessionProducer>(SERVICE_TYPES.AlgorithmSessionProducer);
        producer.all(sessionService.all());
    }

    create(dataGroupId: number, algorithmPlugin: AlgorithmPluginViewModel, inputs: { [id: string]: number[]; }): void {
        const dataService = this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        const pluginPackage = dataService.find(algorithmPlugin.plugin);
        if (!pluginPackage) {
            const producer = this.serviceContainer.resolve<AlgorithmSessionProducer>(SERVICE_TYPES.AlgorithmSessionProducer);
            producer.error(new Error(`Unable to find plugin package with plugin named: ${algorithmPlugin.plugin.name}`));
        } else {
            const dataGroupService = this.serviceContainer
                .resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);

            
            const sessionService = this.serviceContainer.resolve<AlgorithmSessionService>(SERVICE_TYPES.AlgorithmSessionService);
            const features = dataGroupService.getFeatures(dataGroupId, inputs);
            const pluginData = dataGroupService.getPluginData(dataGroupId, inputs);
            sessionService.create(dataGroupId, pluginPackage, algorithmPlugin.plugin,
                pluginData, features)
                .then((session) => {
                    const producer = this.serviceContainer.resolve<AlgorithmSessionProducer>(SERVICE_TYPES.AlgorithmSessionProducer);
                    if (session.algorithmPlugin.getOptions().noMore()) {
                        this.sessionFinish(session);
                    } else {
                        producer.all(sessionService.all());
                        producer.newSession(session);
                    }
                }).catch((reason) => {
                    const producer = this.serviceContainer.resolve<AlgorithmSessionProducer>(SERVICE_TYPES.AlgorithmSessionProducer);
                    producer.error(reason);
                });
        }
    }

    private sessionFinish(session: AlgorithmSession) {
        const dataService = this.serviceContainer.resolve<ExperimentAlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);
        const sessionService = this.serviceContainer.resolve<AlgorithmSessionService>(SERVICE_TYPES.AlgorithmSessionService);
        const dataGroupService = this.serviceContainer
            .resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);

        const dataGroup = dataGroupService.read(session.dataGroupId);

        const algorithm = new ExperimentAlgorithm({
            label: 'New Algorithm',
            dataGroupTrainId: session.dataGroupId,
            algorithmPlugin: session.algorithmPlugin,
            dataGroupFeatures: session.dataGroupFeatures,
            plugin: session.plugin,
            pluginPackage: session.pluginPackage,
            experimentId: dataGroup.experimentId
        });
        
        algorithm.updateProducer = this.serviceContainer.resolve<AlgorithmUpdateProducer>(SERVICE_TYPES.AlgorithmUpdateProducer);

        sessionService.removeFromService(session.dataGroupId);
        dataService.create(algorithm);
        
        const producer = this.serviceContainer.resolve<AlgorithmSessionProducer>(SERVICE_TYPES.AlgorithmSessionProducer);
        producer.finish(session.dataGroupId);
        producer.newAlgorithm(algorithm);
    }


    async executeCommand(dataGroupId: number, command: string) {
        const sessionService = this.serviceContainer.resolve<AlgorithmSessionService>(SERVICE_TYPES.AlgorithmSessionService);
        const session = sessionService.read(dataGroupId);
        const producer = this.serviceContainer.resolve<AlgorithmSessionProducer>(SERVICE_TYPES.AlgorithmSessionProducer);
        const options = session.algorithmPlugin.getOptions();
        try {
            await options.executeCommand(command);
            if (options.noMore()) {
                this.sessionFinish(session);
            } else {
                producer.updateSession(session);
            }
        } catch (reason) {
            producer.error(reason);
        }
    }

    submitOptions(dataGroupId: number, inputs: { [id: string]: any; }): void {
        const sessionService = this.serviceContainer.resolve<AlgorithmSessionService>(SERVICE_TYPES.AlgorithmSessionService);
        const session = sessionService.read(dataGroupId);
        const producer = this.serviceContainer.resolve<AlgorithmSessionProducer>(SERVICE_TYPES.AlgorithmSessionProducer);
        const options = session.algorithmPlugin.getOptions();
        options.submit(inputs);
        if (options.noMore()) {
            this.sessionFinish(session);
        } else {
            producer.updateSession(session);
        }
    }

    delete(dataGroupId: number): void {
        const sessionService = this.serviceContainer.resolve<AlgorithmSessionService>(SERVICE_TYPES.AlgorithmSessionService);
        sessionService.delete(dataGroupId);
        const producer = this.serviceContainer.resolve<AlgorithmSessionProducer>(SERVICE_TYPES.AlgorithmSessionProducer);
        producer.delete(dataGroupId);
        producer.all(sessionService.all());
    }


}

