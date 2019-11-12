import { Experiment, ExperimentList } from '../../../../shared/models';


export interface ExperimentDataService {
    all(): ExperimentList;
    create(experiment: Experiment): Experiment;
    read(id: number): Experiment;
    update(experiment: Experiment): void;
    delete(id: number): void;
}
