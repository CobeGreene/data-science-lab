export class Experiment {
    public id: number;
    public dateCreated: Date;
    public isLoaded: boolean;

    constructor(experiment: {
        id?: number, dateCreated?: Date, isLoaded?: boolean
    }) {
        this.id = experiment.id || 0;
        this.dateCreated = experiment.dateCreated || new Date();
        this.isLoaded = this.isLoaded || false;
    }
}
