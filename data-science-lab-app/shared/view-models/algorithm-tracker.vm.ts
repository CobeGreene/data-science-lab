import { AlgorithmTrackerVariableViewModel } from './algorithm-tracker-variable.vm';

export class AlgorithmTrackerViewModel {

    public algorithmId: number;

    public variables: AlgorithmTrackerVariableViewModel[];
    
    constructor(tracker: {
        algorithmId: number,
        variables?: AlgorithmTrackerVariableViewModel[]
    }) {
        this.algorithmId = tracker.algorithmId;
        this.variables = tracker.variables || [];
    }
}
