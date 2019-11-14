import { Experiment } from './experiment';

export class ExperimentList {
    public experiments: Experiment[];

    constructor(experiments?: Experiment[]) {
        this.experiments = experiments || [];
    }
}
