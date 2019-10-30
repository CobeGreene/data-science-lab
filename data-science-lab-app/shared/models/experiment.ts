import { ExperimentStages } from './experiment_stages';

export abstract class Experiment {
    public id: number;
    public stage: ExperimentStages;

    constructor(experiment: {
        id: number, stage: ExperimentStages
    }) {
        this.id = experiment.id;
        this.stage = experiment.stage;
    }
}
