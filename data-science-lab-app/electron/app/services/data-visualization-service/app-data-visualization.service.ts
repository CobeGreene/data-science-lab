import { VisualizationPluginViewModel } from '../../../../shared/view-models';
import { DataVisualizationService } from './data-visualization.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { VisualizationDataSessionService } from '../../session-services';
import { DataVisualizationSessionProducer } from '../../producers';
import { VisualizationDataService, PackageDataService, ExperimentDataGroupDataService, SettingsDataService } from '../../data-services';
import { VisualizationSession } from '../../models';
import { Visualization } from '../../../../shared/models';

export class AppDataVisualizationService implements DataVisualizationService {

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): void {
        const sessionService = this.serviceContainer
            .resolve<VisualizationDataSessionService>(SERVICE_TYPES.VisualizationDataSessionService);
        const producer = this.serviceContainer.resolve<DataVisualizationSessionProducer>(SERVICE_TYPES.VisualizationDataSessionProducer);
        producer.all(sessionService.all());
    }

    create(id: number, visualizationPlugin: VisualizationPluginViewModel, inputs: { [id: string]: number[]; }): void {
        const dataService = this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        const pluginPackage = dataService.find(visualizationPlugin.plugin);
        if (!pluginPackage) {
            const producer = this.serviceContainer
                .resolve<DataVisualizationSessionProducer>(SERVICE_TYPES.VisualizationDataSessionProducer);
            producer.error(new Error(`Unable to find plugin package with plugin named: ${visualizationPlugin.plugin.name}`));
        } else {

            const dataGroupService = this.serviceContainer
                .resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);

            const sessionService = this.serviceContainer
                .resolve<VisualizationDataSessionService>(SERVICE_TYPES.VisualizationDataSessionService);
            const pluginData = dataGroupService.getPluginData(id, inputs);

            sessionService.create(id, pluginPackage, visualizationPlugin.plugin, pluginData, this.getFeatureEditing(inputs))
                .then((session) => {
                    const producer = this.serviceContainer
                        .resolve<DataVisualizationSessionProducer>(SERVICE_TYPES.VisualizationDataSessionProducer);
                    if (session.visualizationPlugin.getOptions().noMore()) {
                        this.sessionFinish(session);
                    } else {
                        producer.all(sessionService.all());
                        producer.newSession(session);
                    }
                }).catch((reason) => {
                    const producer = this.serviceContainer
                        .resolve<DataVisualizationSessionProducer>(SERVICE_TYPES.VisualizationDataSessionProducer);
                    producer.error(reason);
                });
        }
    }

    getFeatureEditing(inputs: { [id: string]: number[]; }): number[] {
        const features: number[] = [];
        for (const key in inputs) {
            if (inputs[key]) {
                for (const index of inputs[key]) {
                    features.push(index);
                }
            }
        }
        return features;
    }

    async executeCommand(dataGroupId: number, command: string) {
        const sessionService = this.serviceContainer
            .resolve<VisualizationDataSessionService>(SERVICE_TYPES.VisualizationDataSessionService);
        const session = sessionService.read(dataGroupId);
        const producer = this.serviceContainer.resolve<DataVisualizationSessionProducer>(SERVICE_TYPES.VisualizationDataSessionProducer);
        const options = session.visualizationPlugin.getOptions();
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
        const sessionService = this.serviceContainer
            .resolve<VisualizationDataSessionService>(SERVICE_TYPES.VisualizationDataSessionService);
        const session = sessionService.read(dataGroupId);
        const producer = this.serviceContainer.resolve<DataVisualizationSessionProducer>(SERVICE_TYPES.VisualizationDataSessionProducer);
        const options = session.visualizationPlugin.getOptions();
        options.submit(inputs);
        if (options.noMore()) {
            this.sessionFinish(session);
        } else {
            producer.updateSession(session);
        }
    }

    private sessionFinish(session: VisualizationSession) {
        const visualDataService = this.serviceContainer.resolve<VisualizationDataService>(SERVICE_TYPES.VisualizationDataService);
        const dataGroupService = this.serviceContainer
            .resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);
        
        const dataGroup = dataGroupService.read(session.id);
        const visual = session.visualizationPlugin.visualization();

        const visualization = new Visualization({
            id: 0,
            experimentId: dataGroup.experimentId,
            label: 'New Visualization',
            visual
        });

        const newVisualization = visualDataService.create(visualization);

        const visualDataSessionService = this.serviceContainer
            .resolve<VisualizationDataSessionService>(SERVICE_TYPES.VisualizationDataSessionService);
        
        visualDataSessionService.delete(session.id);

        const producer = this.serviceContainer.resolve<DataVisualizationSessionProducer>(SERVICE_TYPES.VisualizationDataSessionProducer);

        producer.newVisualization(newVisualization);
        producer.finish(session.id);
    }

    delete(id: number): void {
        const visualDataSessionService = this.serviceContainer
            .resolve<VisualizationDataSessionService>(SERVICE_TYPES.VisualizationDataSessionService);
        visualDataSessionService.delete(id);
        const producer = this.serviceContainer.resolve<DataVisualizationSessionProducer>(SERVICE_TYPES.VisualizationDataSessionProducer);
        producer.delete(id);
        producer.all(visualDataSessionService.all());
    }


}

