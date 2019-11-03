import { Experiment } from '../experiment';
import { ExperimentStages } from '../experiment_stages';

export class ExperimentSelectAlgorithmStage extends Experiment {

    constructor(experiment: {
        id: number
    }) {
        super({ id: experiment.id, stage: ExperimentStages.Select_Algorithm });
    }
}
