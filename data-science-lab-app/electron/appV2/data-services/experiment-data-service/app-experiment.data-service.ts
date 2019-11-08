import { ExperimentDataService } from './experiment.data-service';
import { Experiment } from '../../models';

export class AppExperimentDataService implements ExperimentDataService {
    
    private experiments: Experiment[];
    private nextId: number;

    constructor() {
        this.experiments = [];
        this.nextId = 1;
    }
    
    all(): Experiment[] {
        return this.experiments;
    }    
    
    create(experiment: Experiment): Experiment {
        experiment.id = this.nextId++;
        this.experiments.push(experiment);
        return experiment;
    }
    
    read(id: number): Experiment {
        const find = this.experiments.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find experiment with id ${id}.`);
    }
    
    update(experiment: Experiment): void {
        const findIndex = this.experiments.findIndex((value) => {
            return value.id === experiment.id;
        });
        if (findIndex >= 0) {
            this.experiments[findIndex] = experiment;
        } else {
            throw new Error(`Couldn't find experiment with id ${experiment.id}.`);
        }
    }
    
    delete(id: number): void {
        const findIndex = this.experiments.findIndex((value) => {
            return value.id === id;
        });
        if (findIndex >= 0) {
            this.experiments.splice(findIndex, 1);
        } else {
            throw new Error(`Couldn't find experiment with id ${id}.`);
        }
    }



}

