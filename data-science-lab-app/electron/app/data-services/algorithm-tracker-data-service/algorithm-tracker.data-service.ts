import { AlgorithmTracker  } from '../../models';
import { VariableTracker } from 'data-science-lab-core';

export interface AlgorithmTrackerDataService {
    all(): AlgorithmTracker[];
    has(id: number): boolean;
    read(id: number): AlgorithmTracker;
    update(id: number, trackers: VariableTracker[]): AlgorithmTracker;
    delete(id: number): void;
    create(id: number, trackers: VariableTracker[]): AlgorithmTracker;
}
