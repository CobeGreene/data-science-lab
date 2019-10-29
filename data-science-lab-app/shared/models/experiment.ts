export class Experiment {
    public id: number;

    constructor(experiment: {
        id: number
    }) {
        this.id = experiment.id;
    }
}
