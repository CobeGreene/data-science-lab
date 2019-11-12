import { FetchSessionViewModel } from '../../../../shared/view-models';
import { Plugin } from '../../../../shared/models';
import { Subject } from 'rxjs';

export abstract class FetchSessionService {

    public newSession: Subject<FetchSessionViewModel>;
    public sessionDeleted: Subject<number>;
    public sessionUpdated: Subject<FetchSessionViewModel>;
    public sessionFinished: Subject<number>;

    constructor() {
        this.newSession = new Subject<FetchSessionViewModel>();
        this.sessionDeleted = new Subject<number>();
        this.sessionUpdated = new Subject<FetchSessionViewModel>();
        this.sessionFinished = new Subject<number>();
    }

    abstract get(experimentId: number): FetchSessionViewModel;
    abstract hasSession(experimentId: number): boolean; 
    abstract create(experimentId: number, plugin: Plugin): void;
    abstract delete(experimentId: number): void;
    
    abstract submitOptions(experimentId: number, inputs: {[id: string]: any}): void;
    abstract executeCommand(experimentId: number, command: string): void;
     
}
