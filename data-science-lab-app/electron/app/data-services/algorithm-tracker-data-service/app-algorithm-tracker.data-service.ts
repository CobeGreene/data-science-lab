import { AlgorithmTrackerDataService } from './algorithm-tracker.data-service';
import { AlgorithmTracker, AlgorithmTrackerVariable } from '../../models';
import { VariableTracker, PluginData } from 'data-science-lab-core';



export class AppAlgorithmTrackerDataService implements AlgorithmTrackerDataService {

    private trackers: AlgorithmTracker[];

    constructor() {
        this.trackers = [];
    }

    all(): AlgorithmTracker[] {
        return this.trackers;
    }

    has(id: number): boolean {
        return this.trackers.findIndex((value) => {
            return value.algorithmId === id;
        }) >= 0;
    }

    read(id: number): AlgorithmTracker {
        const find = this.trackers.find((value) => {
            return value.algorithmId === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find algroithm tracker with id ${id}`);
    }

    delete(id: number): void {
        const findIndex = this.trackers.findIndex((value) => {
            return value.algorithmId === id;
        });
        if (findIndex >= 0) {
            this.trackers.splice(findIndex, 1);
        } else {
            throw new Error(`Couldn't find algorithm tracker with id ${id}`);
        }
    }


    getType(data: any): string {
        if (data instanceof Array) {
            return `${this.getType(data[0])}[]`;
        }
        return typeof data;
    }

    update(id: number, trackers: VariableTracker[]): AlgorithmTracker {
        const find = this.trackers.findIndex((value) => {
            return value.algorithmId === id;
        });
        if (find >= 0) {
            trackers.forEach((variable) => {
                const trackerVariable = this.trackers[find].variables.find((tracker) => {
                    return tracker.label === variable.label;
                });
                if (trackerVariable) {
                    trackerVariable.add(variable.value);
                } else {
                    this.trackers[find].variables.push(new AlgorithmTrackerVariable({
                        label: variable.label,
                        description: variable.description,
                        values: [variable.value],
                        type: this.getType(variable.value)
                    }));
                }
            });
            return this.trackers[find];
        } else {
            throw new Error(`Couldn't find algorithm tracker with id ${id}`);
        }
    }
    create(id: number, trackers: VariableTracker[]): AlgorithmTracker {
        if (this.has(id)) {
            throw new Error(`Algorithm with id ${id} already has tracker.`);
        }
        const tracker = new AlgorithmTracker({
            algorithmId: id
        });
        trackers.forEach((variable) => {
            tracker.variables.push(new AlgorithmTrackerVariable({
                label: variable.label,
                description: variable.description,
                values: [variable.value],
                type: this.getType(variable.value)
            }));
        });

        this.trackers.push(tracker);
        return tracker;
    }

    getPluginData(id: number, inputs: { [id: string]: number[]; }): { [id: string]: PluginData } {
        const tracker = this.read(id);
        const pluginData: {[id: string]: PluginData } = {};
        for (const key in inputs) {
            if (inputs[key]) {
                const features: string[] = [];
                const examples: any[][] = [];
                
                for (let j = 0; j < inputs[key].length; ++j) {
                    features.push(tracker.variables[inputs[key][j]].label);
                    for (let i = 0; i < tracker.variables[inputs[key][j]].values.length; ++i) {
                        if (examples.length <= i) {
                            examples.push([]);
                        }
                        if (examples[i].length <= j) {
                            examples[i].push(undefined);
                        }
                        examples[i][j] = tracker.variables[inputs[key][j]].values[i];
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

}

