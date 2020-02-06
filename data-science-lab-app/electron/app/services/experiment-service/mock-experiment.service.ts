import { ExperimentService } from './experiment.service';


export class MockExperimentService implements ExperimentService {
    all: () => void;
    
    create: () => void;

    load: () => void;
    save: () => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => {};
        this.create = () => {};
        this.load = () => {};
        this.reset = () => {};
    }
}

