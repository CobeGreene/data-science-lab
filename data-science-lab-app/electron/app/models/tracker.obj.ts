import { TrackerVariable, Iteration } from '../../../shared/models';

export interface TrackerObject {
    algorithmId: number;
    variables: TrackerVariable[];
    iterations: Iteration[];
}
