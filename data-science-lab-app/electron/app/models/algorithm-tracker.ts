import { AlgorithmTrackerVariable } from './algorithm-tracker-variable';

export class AlgorithmTracker {
    public algorithmId: number;

    public variables: AlgorithmTrackerVariable[];
    
    constructor(tracker: {
        algorithmId: number,
        variables?: AlgorithmTrackerVariable[]
    }) {
        this.algorithmId = tracker.algorithmId;
        this.variables = tracker.variables || [];
    }

}
