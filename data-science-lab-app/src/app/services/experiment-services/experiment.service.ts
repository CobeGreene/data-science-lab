import { Subject } from 'rxjs';

export abstract class ExperimentService {

    public experimentsChanged: Subject<any>;
    public experimentUpdated: Subject<any>;
    public newExperiment: Subject<any>;

    abstract all(): any[];
    abstract create(): void;
    abstract get(id: number): any;

}

