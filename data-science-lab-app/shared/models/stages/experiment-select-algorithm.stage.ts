import { Experiment } from '../experiment';
import { ExperimentStages } from '../experiment_stages';
import { Vector } from 'data-science-lab-core';

export class ExperimentSelectAlgorithmStage extends Experiment {

    data: Vector[];

    constructor(experiment: {
        id: number, data: Vector[]
    }) {
        super({ id: experiment.id, stage: ExperimentStages.Select_Algorithm });
        this.data = experiment.data;
    }
}
