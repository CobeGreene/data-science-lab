import { AlgorithmPluginViewModel, AlgorithmSessionViewModel } from '../../../../shared/view-models';
import { Subject } from 'rxjs';


export abstract class AlgorithmSessionService {

    public newSession: Subject<AlgorithmSessionViewModel>;
    public sessionDeleted: Subject<number>;
    public sessionUpdated: Subject<AlgorithmSessionViewModel>;
    public sessionFinished: Subject<number>;

    constructor() {
        this.newSession = new Subject<AlgorithmSessionViewModel>();
        this.sessionDeleted = new Subject<number>();
        this.sessionUpdated = new Subject<AlgorithmSessionViewModel>();
        this.sessionFinished = new Subject<number>();
    }

    abstract get(dataGroupId: number): AlgorithmSessionViewModel;
    abstract hasSession(dataGroupId: number): boolean;
    abstract create(dataGroupId: number, plugin: AlgorithmPluginViewModel, inputs: {[id: string]: number[]}): void;
    abstract delete(dataGroupId: number): void;

    abstract submitOptions(dataGroupId: number, inputs: {[id: string]: any}): void;
    abstract executeCommand(dataGroupId: number, command: string): void;

}

