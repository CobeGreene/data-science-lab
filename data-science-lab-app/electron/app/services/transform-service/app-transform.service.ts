import { SelectTransformPlugin } from '../../../../shared/models';
import { TransformService } from './transform.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { TransformSessionService } from '../../session-services';
import { TransformSessionProducer } from '../../producers';
import { PackageDataService, ExperimentDataGroupDataService } from '../../data-services';
import { TransformSession, ExperimentDataGroup } from '../../models';
import { PluginDataConverter } from '../../converters/plugin-data-converter';
import { PluginData } from 'data-science-lab-core';

export class AppTransformService implements TransformService {

    constructor(private serviceContaer: ServiceContainer) {

    }

    all(): void {
        const sessionService = this.serviceContaer.resolve<TransformSessionService>(SERVICE_TYPES.TransformSessionService);
        const producer = this.serviceContaer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
        producer.all(sessionService.all());
    }

    create(dataGroupId: number, transformPlugin: SelectTransformPlugin, inputs: { [id: string]: number[]; }): void {
        const dataService = this.serviceContaer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        const pluginPackage = dataService.find(transformPlugin.plugin);
        if (!pluginPackage) {
            const producer = this.serviceContaer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
            producer.error(new Error(`Unable to find plugin package with plugin named: ${transformPlugin.plugin.name}`))
        } else {
            const dataGroupService = this.serviceContaer
                .resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);
            const dataGroup = dataGroupService.read(dataGroupId);

            const sessionService = this.serviceContaer.resolve<TransformSessionService>(SERVICE_TYPES.TransformSessionService);
            const pluginData = this.getPluginData(dataGroup, inputs);
            sessionService.create(dataGroupId, pluginPackage, transformPlugin.plugin, pluginData)
                .then((session) => {
                    const producer = this.serviceContaer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
                    producer.all(sessionService.all());
                    producer.newSession(session);
                }).catch((reason) => {
                    const producer = this.serviceContaer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
                    producer.error(reason);
                });
        }
    }

    async executeCommand(dataGroupId: number, command: string) {
        const sessionService = this.serviceContaer.resolve<TransformSessionService>(SERVICE_TYPES.TransformSessionService);
        const session = sessionService.read(dataGroupId);
        const producer = this.serviceContaer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
        const options = session.transformPlugin.getOptions();
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
        const sessionService = this.serviceContaer.resolve<TransformSessionService>(SERVICE_TYPES.TransformSessionService);
        const session = sessionService.read(dataGroupId);
        const producer = this.serviceContaer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
        const options = session.transformPlugin.getOptions();
        options.submit(inputs);
        if (options.noMore()) {
            this.sessionFinish(session);
        } else {
            producer.updateSession(session);
        }
    }

    private getPluginData(dataGroup: ExperimentDataGroup, inputs: { [id: string]: number[]; }): { [id: string]: PluginData } {
        const pluginData: { [id: string]: PluginData } = {};
        for (const key in inputs) {
            if (inputs[key]) {
                const features: string[] = [];
                const examples: any[][] = [];

                for (let i = 0; i < dataGroup.examples; ++i) {
                    examples.push([]);
                    for (const _ of inputs[key]) {
                        examples[i].push(undefined);
                    }
                }

                for (let j = 0; j < inputs[key].length; ++j) {
                    features.push(dataGroup.features[inputs[key][j]].name);
                    for (let i = 0; i < dataGroup.features[inputs[key][j]].examples.length; ++i) {
                        examples[i][j] = dataGroup.features[inputs[key][j]].examples[i];
                    }
                }

                pluginData[key] = new PluginData({
                    features,
                    examples
                });
            }
        }
        return pluginData;
    }

    private sessionFinish(session: TransformSession) {

    }

    delete(dataGroupId: number): void {
        const sessionService = this.serviceContaer.resolve<TransformSessionService>(SERVICE_TYPES.TransformSessionService);
        sessionService.delete(dataGroupId);
        const producer = this.serviceContaer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
        producer.delete(dataGroupId);
        producer.all(sessionService.all());
    }


}

