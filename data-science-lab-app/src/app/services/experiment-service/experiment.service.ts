import { Subject } from 'rxjs';
import { Experiment } from '../../../../shared/models';

export abstract class ExperimentService {
    experimentsChanged: Subject<Experiment[]>;
    experimentUpdated: Subject<Experiment>;
    experimentCreated: Subject<Experiment>;
    experimentDeleted: Subject<number>;

    constructor() {
        this.experimentsChanged = new Subject<Experiment[]>();
        this.experimentUpdated = new Subject<Experiment>();
        this.experimentCreated = new Subject<Experiment>();
        this.experimentDeleted = new Subject<number>();
    }

    abstract all(): Experiment[];
    abstract create(title: string, description?: string): void;
    abstract get(id: number): Experiment;
    abstract update(id: number, title: string, description?: string): void;
    abstract delete(id: number): void;
}

