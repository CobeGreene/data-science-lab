import { Experiment } from '../../../../shared/models';


export interface ExperimentDataService {
    all(): Experiment[];
    create(experiment: Experiment): Experiment;
    read(id: number): Experiment;
    update(experiment: Experiment): void;
    delete(id: number): void;
}
