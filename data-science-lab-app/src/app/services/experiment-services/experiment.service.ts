import { Experiment, ExperimentList } from '../../../../shared/models';
import { Subject } from 'rxjs';

export abstract class ExperimentService {

    public experimentsChanged: Subject<ExperimentList>;
    public experimentUpdated: Subject<Experiment>;
    public newExperiment: Subject<Experiment>;

    constructor() {
        this.experimentsChanged = new Subject<ExperimentList>();
        this.experimentUpdated = new Subject<Experiment>();
        this.newExperiment = new Subject<Experiment>();
    }

    abstract all(): ExperimentList;
    abstract create(): void;
    abstract get(id: number): any;
}

