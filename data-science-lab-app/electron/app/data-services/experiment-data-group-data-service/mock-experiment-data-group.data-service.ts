import { ExperimentDataGroupDataService } from './experiment-data-group.data-service';
import { ExperimentDataGroup } from '../../models';


export class MockExperimentDataGroupDataService implements ExperimentDataGroupDataService {
    all: (experimentId?: number) => ExperimentDataGroup[];


    create: (dataGroup: ExperimentDataGroup) => ExperimentDataGroup;

    read: (id: number) => ExperimentDataGroup;


    update: (dataGroup: ExperimentDataGroup) => void;


    delete: (id: number) => void;

    deleteByExperiment: (experimentId: number) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = (): ExperimentDataGroup[] => { throw new Error(`Not Implemented`); }
        this.create = () => { throw new Error(`Not implemented`); };
        this.read = () => { throw new Error(`Not implemented`); };
        this.update = () => { };
        this.delete = () => { };
        this.deleteByExperiment = () => { };
    }

}
