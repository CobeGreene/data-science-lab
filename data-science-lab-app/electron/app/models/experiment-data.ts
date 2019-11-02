import { ExperimentStages } from '../../../shared/models';

export class ExperimentData {
    public id: number;
    public stage: ExperimentStages;

    constructor(data: { id: number, stage: ExperimentStages }) {
        this.id = data.id;
        this.stage = data.stage;
    }
}
