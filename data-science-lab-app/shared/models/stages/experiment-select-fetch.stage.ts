import { Experiment } from '../experiment';
import { ExperimentStages } from '../experiment_stages';

export class ExperimentSelectFetchStage extends Experiment {

    constructor(experiment: {
        id: number
    }) {
        super({ id: experiment.id, stage: ExperimentStages.Select_Fetch });
    }
}
