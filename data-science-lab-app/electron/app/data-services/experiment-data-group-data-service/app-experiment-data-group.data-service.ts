import { ExperimentDataGroupDataService } from './experiment-data-group.data-service';
import { ExperimentDataGroup, ExperimentFeature } from '../../models';
import { PluginData } from 'data-science-lab-core';

export class AppExperimentDataGroupDataService implements ExperimentDataGroupDataService {

    private dataGroups: ExperimentDataGroup[];
    private nextId: number;

    constructor() {
        this.dataGroups = [];
        this.nextId = 1;
    }

    all(experimentId?: number): ExperimentDataGroup[] {
        if (experimentId) {
            return this.dataGroups.filter((value) => {
                return value.experimentId === experimentId;
            });
        } else {
            return this.dataGroups;
        }
    }

    create(dataGroup: ExperimentDataGroup): ExperimentDataGroup {
        dataGroup.id = this.nextId++;
        this.dataGroups.push(dataGroup);
        return dataGroup;
    }

    read(id: number): ExperimentDataGroup {
        const find = this.dataGroups.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find experiment data group with id ${id}`);
    }

    update(dataGroup: ExperimentDataGroup): void {
        const findIndex = this.dataGroups.findIndex((value) => {
            return value.id === dataGroup.id;
        });
        if (findIndex >= 0) {
            this.dataGroups[findIndex] = dataGroup;
        } else {
            throw new Error(`Couldn't find experiment data group with id ${dataGroup.id}.`);
        }
    }

    delete(id: number): void {
        const findIndex = this.dataGroups.findIndex((value) => {
            return value.id === id;
        });
        if (findIndex >= 0) {
            this.dataGroups.splice(findIndex, 1);
        } else {
            throw new Error(`Couldn't find experiment data group with id ${id}.`);
        }
    }

    load(groups: ExperimentDataGroup[]) {
        groups.forEach((value) => {
            const group = Object.setPrototypeOf(value, ExperimentDataGroup.prototype) as ExperimentDataGroup;
            group.features = group.features
                .map(feature => Object.setPrototypeOf(feature, ExperimentFeature.prototype) as ExperimentFeature);
            this.dataGroups.push(group);
        });
    }

    deleteByExperiment(experimentId: number): void {
        this.dataGroups.filter((value) => {
            return value.experimentId === experimentId;
        }).map((value) => {
            return value.id;
        }).forEach((value) => {
            this.delete(value);
        });
    }

    getPluginData(id: number, inputs: { [id: string]: number[]; }): { [id: string]: PluginData } {
        const dataGroup = this.read(id);
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

    getFeatures(id: number, inputs: { [id: string]: number[]; }): { [id: string]: { label: string, type: string }[] } {
        const dataGroup = this.read(id);
        const features: { [id: string]: { label: string, type: string }[] } = {};
        for (const key in inputs) {
            if (inputs[key]) {
                features[key] = [];
                for (const indice of inputs[key]) {
                    features[key].push({ label: dataGroup.features[indice].name, type: dataGroup.features[indice].type });
                }
            }
        }
        return features;
    }
}
