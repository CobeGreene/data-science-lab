import { TrackerObject } from '../../models';
import { AlgorithmTracker } from '../../../../shared/models';
import { VariableTracker } from 'data-science-lab-core';

export interface TrackerDataService {
    all(): TrackerObject[];
    allView(): AlgorithmTracker[];
    update(tracker: TrackerObject): void;
    get(algorithmId: number): TrackerObject;
    has(algorithmId: number): boolean;
    view(algorithmId: number): AlgorithmTracker;
    load(algorithmId: number): void;
    save(algorithmId: number): void;
    create(algorithmId: number): void;
    push(algorithmId: number, iteration: number, variables: VariableTracker[]): void;
}
