import { Experiment } from '../../../../shared/models';

export interface ExperimentDataService {
    configure(): void;
    all(): Experiment[];
    post(experiment: Experiment): Experiment;
    get(id: number): Experiment;
    update(experiment: Experiment): void;
    delete(id: number): void;   
}
