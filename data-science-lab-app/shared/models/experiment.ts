export class Experiment {
    public id: number;
    public dateCreated: Date;

    constructor(experiment: {
        id?: number, dateCreated?: Date,
    }) {
        this.id = experiment.id || 0;
        this.dateCreated = experiment.dateCreated || new Date();
    }
}
