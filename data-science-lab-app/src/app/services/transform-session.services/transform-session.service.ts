import { TransformSessionViewModel, TransformPluginViewModel } from '../../../../shared/view-models';
import { Subject } from 'rxjs';
import { Plugin } from '../../../../shared/models';

export abstract class TransformSessionService {

    public newSession: Subject<TransformSessionViewModel>;
    public sessionDeleted: Subject<number>;
    public sessionUpdated: Subject<TransformSessionViewModel>;
    public sessionFinished: Subject<number>;

    constructor() {
        this.newSession = new Subject<TransformSessionViewModel>();
        this.sessionDeleted = new Subject<number>();
        this.sessionUpdated = new Subject<TransformSessionViewModel>();
        this.sessionFinished = new Subject<number>();
    }

    abstract get(dataGroupId: number): TransformSessionViewModel;
    abstract hasSession(dataGroupId: number): boolean;
    abstract create(dataGroupId: number, plugin: TransformPluginViewModel, inputs: {[id: string]: number[]}): void;
    abstract delete(dataGroupId: number): void;

    abstract submitOptions(dataGroupId: number, inputs: {[id: string]: any}): void;
    abstract executeCommand(dataGroupId: number, command: string): void;

} 
