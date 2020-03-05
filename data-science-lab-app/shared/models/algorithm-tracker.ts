import { TrackerVariable } from './tracker-variable';
import { Iteration } from './iteration';

export interface AlgorithmTracker {
    algorithmId: number;
    variables: TrackerVariable[];
    recentIterations: Iteration[];
}
