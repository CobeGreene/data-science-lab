import { FetchSessionViewModel } from '../../../../shared/view-models';
import { Plugin } from '../../../../shared/models';
import { Subject } from 'rxjs';

export abstract class FetchSessionService {

    public newSession: Subject<FetchSessionViewModel>;

    constructor() {
        this.newSession = new Subject<FetchSessionViewModel>();
    }

    abstract get(experimentId: number): FetchSessionViewModel;
    abstract hasSession(experimentId: number): boolean; 
    abstract create(experimentId: number, plugin: Plugin);
}
