import { ExperimentAlgorithmDataService } from './algorithm.data-service';
import { ExperimentAlgorithm } from '../../models';


export class MockExperimentAlgorithmDataService implements ExperimentAlgorithmDataService {
    all: (experimentId?: number) => ExperimentAlgorithm[];


    create: (dataGroup: ExperimentAlgorithm) => ExperimentAlgorithm;

    read: (id: number) => ExperimentAlgorithm;


    update: (dataGroup: ExperimentAlgorithm) => void;


    delete: (id: number) => void;

    deleteByExperiment: (experimentId: number) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = (): ExperimentAlgorithm[] => { throw new Error(`Not Implemented`); }
        this.create = () => { throw new Error(`Not implemented`); };
        this.read = () => { throw new Error(`Not implemented`); };
        this.update = () => { };
        this.delete = () => { };
        this.deleteByExperiment = () => { };
    }

}
