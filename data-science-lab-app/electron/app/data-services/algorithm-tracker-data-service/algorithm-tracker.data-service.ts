import { AlgorithmTracker  } from '../../models';
import { VariableTracker, PluginData } from 'data-science-lab-core';

export interface AlgorithmTrackerDataService {
    all(): AlgorithmTracker[];
    has(id: number): boolean;
    read(id: number): AlgorithmTracker;
    update(id: number, trackers: VariableTracker[]): AlgorithmTracker;
    delete(id: number): void;
    load(trackers: AlgorithmTracker[]);
    create(id: number, trackers: VariableTracker[]): AlgorithmTracker;
    getPluginData(id: number, inputs: { [id: string]: number[]}): { [id: string]: PluginData };
}
