import { ExperimentData } from '../../models';

export interface ExperimentDataService {
    all(): ExperimentData[];
    get(id: number): ExperimentData;
    create(): ExperimentData;
    delete(id: number): void;
    update(id: number, experimentData: ExperimentData);
}
