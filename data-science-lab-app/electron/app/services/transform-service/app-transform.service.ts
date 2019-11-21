import { SelectTransformPlugin } from '../../../../shared/models';
import { TransformService } from './transform.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { TransformSessionService } from '../../session-services';
import { TransformSessionProducer } from '../../producers';
import { PackageDataService, ExperimentDataGroupDataService, SettingsDataService } from '../../data-services';
import { TransformSession, ExperimentDataGroup } from '../../models';
import { PluginDataConverter } from '../../converters/plugin-data-converter';
import { PluginData } from 'data-science-lab-core';

export class AppTransformService implements TransformService {

    constructor(private serviceContainer: ServiceContainer) {

    }

    all(): void {
        const sessionService = this.serviceContainer.resolve<TransformSessionService>(SERVICE_TYPES.TransformSessionService);
        const producer = this.serviceContainer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
        producer.all(sessionService.all());
    }

    create(dataGroupId: number, transformPlugin: SelectTransformPlugin, inputs: { [id: string]: number[]; }): void {
        const dataService = this.serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        const pluginPackage = dataService.find(transformPlugin.plugin);
        if (!pluginPackage) {
            const producer = this.serviceContainer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
            producer.error(new Error(`Unable to find plugin package with plugin named: ${transformPlugin.plugin.name}`));
        } else {
            const dataGroupService = this.serviceContainer
                .resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);
            const dataGroup = dataGroupService.read(dataGroupId);

            const sessionService = this.serviceContainer.resolve<TransformSessionService>(SERVICE_TYPES.TransformSessionService);
            const pluginData = this.getPluginData(dataGroup, inputs);
            sessionService.create(dataGroupId, pluginPackage, transformPlugin.plugin, pluginData, this.getFeatureEditing(dataGroup, inputs))
                .then((session) => {
                    const producer = this.serviceContainer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
                    if (session.transformPlugin.getOptions().noMore()) {
                        this.sessionFinish(session);
                    } else {
                        producer.all(sessionService.all());
                        producer.newSession(session);
                    }
                }).catch((reason) => {
                    const producer = this.serviceContainer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
                    producer.error(reason);
                });
        }
    }

    getFeatureEditing(dataGroup: ExperimentDataGroup, inputs: { [id: string]: number[]; }): number[] {
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
        const sessionService = this.serviceContainer.resolve<TransformSessionService>(SERVICE_TYPES.TransformSessionService);
        const session = sessionService.read(dataGroupId);
        const producer = this.serviceContainer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
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
        const sessionService = this.serviceContainer.resolve<TransformSessionService>(SERVICE_TYPES.TransformSessionService);
        const session = sessionService.read(dataGroupId);
        const producer = this.serviceContainer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
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
        const temp = session.transformPlugin.transform();
        const transformPluginData: PluginData[] = temp instanceof Array ? temp : [temp];
        const converter = this.serviceContainer.resolve<PluginDataConverter>(SERVICE_TYPES.PluginDataConverter);
        const dataGroups: ExperimentDataGroup[] = [];
        for (const pluginData of transformPluginData) {
            for (const dataGroup of converter.toDataGroups(pluginData)) {
                dataGroups.push(dataGroup);
            }
        }
        const dataService = this.serviceContainer.resolve<ExperimentDataGroupDataService>(SERVICE_TYPES.ExperimentDataGroupDataService);
        const currentDataGroup = dataService.read(session.dataGroupId);
        const newDataGroups: ExperimentDataGroup[] = [];
        const indicesToRemove: number[] = [];

        for (const dataGroup of dataGroups) {
            const possibleNewDataGroup = new ExperimentDataGroup({
                label: dataGroup.label,
                experimentId: currentDataGroup.experimentId
            });

            for (const feature of dataGroup.features) {
                let inCurrent = false;
                let indexOfCurrent = -1;

                for (let j = 0; j < session.featuresEditing.length; ++j) {
                    if (currentDataGroup.features[session.featuresEditing[j]].name === feature.name) {
                        indexOfCurrent = j;
                        inCurrent = true;
                        break;
                    }
                }
                // in current
                if (inCurrent) {
                    // if the data group example is the same size we keep it.
                    if (dataGroup.examples === currentDataGroup.examples) {
                        currentDataGroup.features[session.featuresEditing[indexOfCurrent]] = feature;
                    } else {
                        // else we remove from current and create a new data group
                        indicesToRemove.push(session.featuresEditing[indexOfCurrent]);
                        session.featuresEditing.splice(indexOfCurrent, 1);
                        possibleNewDataGroup.add(feature);
                    }
                } else {
                    // if the data group is the same as current we add feature
                    if (dataGroup.examples === currentDataGroup.examples) {
                        currentDataGroup.add(feature);
                    } else {
                        // else we create new data group.
                        possibleNewDataGroup.add(feature);
                    }
                }
            }


            if (possibleNewDataGroup.features.length > 0) {
                newDataGroups.push(possibleNewDataGroup);
            }
        }

        currentDataGroup.features = currentDataGroup.features.filter((x, i) => indicesToRemove.indexOf(i) === -1);

        const settingsDataService = this.serviceContainer.resolve<SettingsDataService>(SERVICE_TYPES.SettingsDataService);
        const dataGroupSettings = settingsDataService.readDataGroupSettings();
        const producer = this.serviceContainer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);

        for (const group of newDataGroups) {
            dataService.create(group);
            producer.newDataGroup(group, dataGroupSettings);
        }

        if (currentDataGroup.features.length === 0) {
            dataService.delete(currentDataGroup.id);
            // deleted data group
        } else {
            dataService.update(currentDataGroup);
            producer.updateDataGroup(currentDataGroup, dataGroupSettings);
        }


        const sessionService = this.serviceContainer.resolve<TransformSessionService>(SERVICE_TYPES.TransformSessionService);
        const id = session.dataGroupId;
        sessionService.delete(id);
        producer.finish(id);
    }

    delete(dataGroupId: number): void {
        const sessionService = this.serviceContainer.resolve<TransformSessionService>(SERVICE_TYPES.TransformSessionService);
        sessionService.delete(dataGroupId);
        const producer = this.serviceContainer.resolve<TransformSessionProducer>(SERVICE_TYPES.TransformSessionProducer);
        producer.delete(dataGroupId);
        producer.all(sessionService.all());
    }


}

