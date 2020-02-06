import { Subject } from 'rxjs';
import { Visualization } from '../../../../shared/models';


export abstract class VisualizationsService {
    public newVisualization: Subject<Visualization>;
    public deletedVisualization: Subject<number>;
    public updatedVisualization: Subject<Visualization>;
    public visualizationChanges: Subject<Visualization[]>;

    constructor() {
        this.newVisualization = new Subject<Visualization>();
        this.deletedVisualization = new Subject<number>();
        this.updatedVisualization = new Subject<Visualization>();
        this.visualizationChanges = new Subject<Visualization[]>();
    }

    abstract all(experimentId: number): Visualization[];
    abstract get(id: number): Visualization;
    abstract delete(id: number): void;
}
