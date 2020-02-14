import { Experiment, ExperimentList } from '../../../../shared/models';
import { Subject } from 'rxjs';

export abstract class ExperimentService {

    public experimentsChanged: Subject<ExperimentList>;
    public experimentUpdated: Subject<Experiment>;
    public newExperiment: Subject<Experiment>;
    public loadExperiment: Subject<number>;

    constructor() {
        this.experimentsChanged = new Subject<ExperimentList>();
        this.experimentUpdated = new Subject<Experiment>();
        this.newExperiment = new Subject<Experiment>();
        this.loadExperiment = new Subject<number>();
    }

    abstract all(): ExperimentList;
    abstract create(): void;
    abstract get(id: number): any;
    abstract load(id: number): any;
    abstract save(id: number): void;
}

