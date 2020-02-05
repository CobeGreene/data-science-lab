import { AlgorithmService } from './algorithm.service';


export class MockAlgorithmService implements AlgorithmService {

    all: () => void;
    delete: (id: number) => void;
    start: (id: number) => void;
    stop: (id: number) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => {};
        this.delete = () => {};
        this.start = () => {};
        this.stop = () => {};
    }
}


