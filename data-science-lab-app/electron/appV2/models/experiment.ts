import { ExperimentStages } from './experiment-stages';

export class Experiment {
    public id: number;
    public dateCreated: Date;
    public stage: ExperimentStages;

    constructor(experiment: {
        id?: number, dateCreated?: Date,
        stage?: ExperimentStages
    }) {
        this.id = experiment.id || 0;
        this.dateCreated = experiment.dateCreated || new Date();
        this.stage = experiment.stage || ExperimentStages.Data_Workspace;
    }
}
