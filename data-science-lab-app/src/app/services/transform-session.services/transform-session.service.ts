import { TransformSessionViewModel } from '../../../../shared/view-models';
import { Subject } from 'rxjs';
import { Plugin, SelectTransformPlugin } from '../../../../shared/models';

export abstract class TransformSessionService {

    public newSession: Subject<TransformSessionViewModel>;
    public sessionDeleted: Subject<{ experimentId: number, dataGroupId: number}>;
    public sessionUpdated: Subject<TransformSessionViewModel>;
    public sessionFinished: Subject<{ experimentId: number, dataGroupId: number}>;

    constructor() {
        this.newSession = new Subject<TransformSessionViewModel>();
        this.sessionDeleted = new Subject<{ experimentId: number, dataGroupId: number}>();
        this.sessionUpdated = new Subject<TransformSessionViewModel>();
        this.sessionFinished = new Subject<{ experimentId: number, dataGroupId: number}>();
    }

    abstract get(experimentId: number, dataGroupId: number): TransformSessionViewModel;
    abstract hasSession(experimentId: number, dataGroupId: number): boolean;
    abstract create(experimentId: number, dataGroupId: number, plugin: SelectTransformPlugin): void;
    abstract delete(experimentId: number, dataGroupId: number): void;

    abstract submitOptions(experimentId: number, dataGroupId: number, inputs: {[id: string]: any}): void;
    abstract executeCommand(experimentId: number, dataGroupId: number, command: string): void;

} 
