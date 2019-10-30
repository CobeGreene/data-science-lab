import { Experiment, ExperimentList } from '../../../../shared/models';
import { Subject } from 'rxjs';

export abstract class ExperimentService {
    public experimentsChanged: Subject<ExperimentList>;
    public newExperiment: Subject<Experiment>;

    abstract all(): ExperimentList;
    abstract create(): void; 
    abstract get(id: number): Experiment;
}

