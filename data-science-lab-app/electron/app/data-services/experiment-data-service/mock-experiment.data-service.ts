import { ExperimentDataService } from './experiment.data-service';
import { Experiment, ExperimentList } from '../../../../shared/models';


export class MockExperimentDataService implements ExperimentDataService {
    all: () => ExperimentList;


    create: (experiment: Experiment) => Experiment;

    read: (id: number) => Experiment;
    
    update: (experiment: Experiment) => void;


    delete: (id: number) => void;


    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => new ExperimentList();
        this.create = () => { throw new Error(`Not implemented.`); };
        this.read = () => { throw new Error(`Not implemented.`);};
        this.update = () => { throw new Error(`Not implemented.`);};
        this.delete = () => { throw new Error(`Not implemented.`);};
    }


}
