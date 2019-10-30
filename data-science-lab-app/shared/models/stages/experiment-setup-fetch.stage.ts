import { Experiment } from '../experiment';
import { ExperimentStages } from '../experiment_stages';

export class ExperimentSetupFetchStage extends Experiment {

    constructor(experiment: {
        id: number
    }) {
        super({ id: experiment.id, stage: ExperimentStages.Setup_Fetch });
    }
}
