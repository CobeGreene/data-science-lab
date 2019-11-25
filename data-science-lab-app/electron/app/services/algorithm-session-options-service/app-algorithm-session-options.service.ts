import { AlgorithmPluginViewModel } from '../../../../shared/view-models';
import { AlgorithmSessionOptionsService } from './algorithm-session-options.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { TransformSessionService, AlgorithmSessionService } from '../../session-services';
import { TransformSessionProducer, AlgorithmSessionProducer } from '../../producers';
import { PackageDataService, ExperimentDataGroupDataService, SettingsDataService } from '../../data-services';
import { ExperimentDataGroup, AlgorithmSession } from '../../models';
import { PluginData } from 'data-science-lab-core';


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

    }


    executeCommand(dataGroupId: number, command: string): void {
        throw new Error('Method not implemented.');
    }
    submitOptions(dataGroupId: number, inputs: { [id: string]: any; }): void {
        throw new Error('Method not implemented.');
    }
    delete(dataGroupId: number): void {
        throw new Error('Method not implemented.');
    }


}

