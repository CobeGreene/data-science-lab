import { Subject } from 'rxjs';
import { AlgorithmViewModel } from '../../../../shared/view-models';

export abstract class AlgorithmService {

    public newAlgorithm: Subject<AlgorithmViewModel>;
    public deletedAlgorithm: Subject<number>;
    public updatedAlgorithm: Subject<AlgorithmViewModel>;


    constructor() {
        this.newAlgorithm = new Subject<AlgorithmViewModel>();
        this.deletedAlgorithm = new Subject<number>();
        this.updatedAlgorithm = new Subject<AlgorithmViewModel>();
    }

    abstract all(experimentId: number): AlgorithmViewModel[];
    abstract get(id: number): AlgorithmViewModel;
    abstract delete(id: number): void;

    abstract start(id: number): void;
    abstract stop(id: number): void;
}

