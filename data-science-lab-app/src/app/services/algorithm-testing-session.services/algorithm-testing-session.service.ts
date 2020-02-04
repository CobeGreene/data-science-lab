import { Subject } from 'rxjs';
import { TestingSessionViewModel } from '../../../../shared/view-models';


export abstract class AlgorithmTestingSessionService {

    public newTestingSession: Subject<TestingSessionViewModel>;
    public testingSessionFinish: Subject<number>;

    constructor() {
        this.newTestingSession = new Subject<TestingSessionViewModel>();
        this.testingSessionFinish = new Subject<number>();
    }

    abstract requestTest(id: number, dataGroupId: number): void;
    abstract get(id: number): TestingSessionViewModel;
    abstract startTest(id: number, inputs: {[id: string]: number[]}, output: {[id: string]: number[]}): void;
}


