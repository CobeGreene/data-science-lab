import { VisualizationPluginViewModel } from '../../../../shared/view-models';
import { AlgorithmVisualizationService } from './algorithm-visualization.service';
import { SERVICE_TYPES, ServiceContainer } from '../../services-container';
import { VisualizationAlgorithmSessionService } from '../../session-services';
import { AlgorithmVisualizationSessionProducer } from '../../producers';
import {
    VisualizationDataService, PackageDataService,
    AlgorithmTrackerDataService, ExperimentAlgorithmDataService
} from '../../data-services';
import { VisualizationSession } from '../../models';
import { Visualization } from '../../../../shared/models';

export class AppAlgorithmVisualizationService implements AlgorithmVisualizationService {
    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): void {
        const sessionService = this.serviceContainer
            .resolve<VisualizationAlgorithmSessionService>(SERVICE_TYPES.VisualizationAlgorithmSessionService);
        const producer = this.serviceContainer
            .resolve<AlgorithmVisualizationSessionProducer>(SERVICE_TYPES.VisualizationAlgorithmSessionProducer);
        producer.all(sessionService.all());
    }

    create(id: number, visualizationPlugin: VisualizationPluginViewModel, inputs: { [id: string]: number[]; }): void {
        const packageDataService = this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        const pluginPackage = packageDataService.find(visualizationPlugin.plugin);
        if (!pluginPackage) {
            const producer = this.serviceContainer
                .resolve<AlgorithmVisualizationSessionProducer>(SERVICE_TYPES.VisualizationAlgorithmSessionProducer);
            producer.error(new Error(`Unable to find plugin package with plugin named: ${visualizationPlugin.plugin.name}`));
        } else {
            const algorithmTrackerDataService = this.serviceContainer
                .resolve<AlgorithmTrackerDataService>(SERVICE_TYPES.AlgorithmTrackerDataService);

            const sessionService = this.serviceContainer
                .resolve<VisualizationAlgorithmSessionService>(SERVICE_TYPES.VisualizationAlgorithmSessionService);

            const pluginData = algorithmTrackerDataService.getPluginData(id, inputs);

            sessionService.create(id, pluginPackage, visualizationPlugin.plugin, pluginData, this.getFeatureEditing(inputs))
                .then((session) => {
                    const producer = this.serviceContainer
                        .resolve<AlgorithmVisualizationSessionProducer>(SERVICE_TYPES.VisualizationAlgorithmSessionProducer);
                    if (session.visualizationPlugin.getOptions().noMore()) {
                        this.sessionFinish(session);
                    } else {
                        producer.all(sessionService.all());
                        producer.newSession(session);
                    }
                }).catch((reason) => {
                    const producer = this.serviceContainer
                        .resolve<AlgorithmVisualizationSessionProducer>(SERVICE_TYPES.VisualizationAlgorithmSessionProducer);
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

    async executeCommand(id: number, command: string) {
        const sessionService = this.serviceContainer
            .resolve<VisualizationAlgorithmSessionService>(SERVICE_TYPES.VisualizationAlgorithmSessionService);
        const session = sessionService.read(id);
        const producer = this.serviceContainer
            .resolve<AlgorithmVisualizationSessionProducer>(SERVICE_TYPES.VisualizationAlgorithmSessionProducer);
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

    submitOptions(id: number, inputs: { [id: string]: any; }): void {
        const sessionService = this.serviceContainer
            .resolve<VisualizationAlgorithmSessionService>(SERVICE_TYPES.VisualizationAlgorithmSessionService);
        const session = sessionService.read(id);
        const producer = this.serviceContainer
            .resolve<AlgorithmVisualizationSessionProducer>(SERVICE_TYPES.VisualizationAlgorithmSessionProducer);
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
        const algorithmDataService = this.serviceContainer
            .resolve<ExperimentAlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);

        const algorithm = algorithmDataService.read(session.id);
        const visual = session.visualizationPlugin.visualization();

        const visualization = new Visualization({
            id: 0,
            experimentId: algorithm.experimentId,
            label: 'New Visualization',
            visual
        });

        const newVisualization = visualDataService.create(visualization);

        const visualAlgorithmSessionService = this.serviceContainer
            .resolve<VisualizationAlgorithmSessionService>(SERVICE_TYPES.AlgorithmDataService);

        visualAlgorithmSessionService.delete(session.id);

        const producer = this.serviceContainer
            .resolve<AlgorithmVisualizationSessionProducer>(SERVICE_TYPES.VisualizationAlgorithmSessionProducer);

        producer.newVisualization(newVisualization);
        producer.finish(session.id);
    }

    delete(id: number): void {
        const visualAlgorithmSessionService = this.serviceContainer
            .resolve<VisualizationAlgorithmSessionService>(SERVICE_TYPES.AlgorithmDataService);
        visualAlgorithmSessionService.delete(id);
        const producer = this.serviceContainer
            .resolve<AlgorithmVisualizationSessionProducer>(SERVICE_TYPES.VisualizationAlgorithmSessionProducer);
        producer.delete(id);
        producer.all(visualAlgorithmSessionService.all());
    }


}
