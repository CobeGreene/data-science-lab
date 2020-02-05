import { Subject } from 'rxjs';
import { AlgorithmTrackerViewModel } from '../../../../shared/view-models';

export abstract class AlgorithmTrackerService {

    public newTracker: Subject<AlgorithmTrackerViewModel>;
    public updateTracker: Subject<AlgorithmTrackerViewModel>;

    constructor() {
        this.newTracker = new Subject<AlgorithmTrackerViewModel>();
        this.updateTracker = new Subject<AlgorithmTrackerViewModel>();
    }

    abstract has(id: number): boolean;
    abstract get(id: number): AlgorithmTrackerViewModel;


}



