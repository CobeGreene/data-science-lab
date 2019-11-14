import { ExperimentProducer } from './experiment.producer';
import { Experiment, ExperimentList } from '../../../../shared/models';

export class MockExperimentProducer implements ExperimentProducer {
    all: (experimentList: ExperimentList) => void;

    newExperiment: (experiment: Experiment) => void;

    error: (reason: any) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = () => {};
        this.newExperiment = () => {};
        this.error = () => {};
    }

}
