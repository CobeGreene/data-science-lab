import { VisualizationSessionViewModel, VisualizationPluginViewModel } from '../../../../shared/view-models';
import { Subject } from 'rxjs';

export abstract class VisualizationDataSessionService {

    public newSession: Subject<VisualizationSessionViewModel>;
    public sessionDeleted: Subject<number>;
    public sessionUpdated: Subject<VisualizationSessionViewModel>;
    public sessionFinished: Subject<number>;

    constructor() {
        this.newSession = new Subject<VisualizationSessionViewModel>();
        this.sessionDeleted = new Subject<number>();
        this.sessionUpdated = new Subject<VisualizationSessionViewModel>();
        this.sessionFinished = new Subject<number>();
    }

    abstract get(id: number): VisualizationSessionViewModel;
    abstract hasSession(id: number): boolean;
    abstract create(id: number, plugin: VisualizationPluginViewModel, inputs: {[id: string]: number[]}): void;
    abstract delete(id: number): void;

    abstract submitOptions(id: number, inputs: {[id: string]: any}): void;
    abstract executeCommand(id: number, command: string): void;

} 
