import { Subject } from 'rxjs';
import { DataGroupViewModel } from '../../../../shared/view-models';

export abstract class DataGroupsService {

    public newDataGroup: Subject<DataGroupViewModel>;
    public deletedDataGroup: Subject<number>;
    public updatedDataGroup: Subject<DataGroupViewModel>;
    public dataGroupsChanged: Subject<DataGroupViewModel[]>;

    constructor() { 
        this.newDataGroup = new Subject<DataGroupViewModel>();
        this.deletedDataGroup = new Subject<number>();
        this.updatedDataGroup = new Subject<DataGroupViewModel>();
        this.dataGroupsChanged = new Subject<DataGroupViewModel[]>();
    }

    abstract all(experimentId: number): DataGroupViewModel[];
    abstract get(id: number): DataGroupViewModel;
    abstract delete(id: number): void;
}
