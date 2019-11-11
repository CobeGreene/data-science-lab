import { ExperimentDataService } from './experiment.data-service';
import { Experiment, ExperimentList } from '../../../../shared/models';

export class AppExperimentDataService implements ExperimentDataService {
    
    private experimentList: ExperimentList;
    private nextId: number;

    constructor() {
        this.experimentList = new ExperimentList();
        this.nextId = 1;
    }
    
    all(): ExperimentList {
        return this.experimentList;
    }    
    
    create(experiment: Experiment): Experiment {
        experiment.id = this.nextId++;
        this.experimentList.experiments.push(experiment);
        return experiment;
    }
    
    read(id: number): Experiment {
        const find = this.experimentList.experiments.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find experiment with id ${id}.`);
    }
    
    update(experiment: Experiment): void {
        const findIndex = this.experimentList.experiments.findIndex((value) => {
            return value.id === experiment.id;
        });
        if (findIndex >= 0) {
            this.experimentList[findIndex] = experiment;
        } else {
            throw new Error(`Couldn't find experiment with id ${experiment.id}.`);
        }
    }
    
    delete(id: number): void {
        const findIndex = this.experimentList.experiments.findIndex((value) => {
            return value.id === id;
        });
        if (findIndex >= 0) {
            this.experimentList.experiments.splice(findIndex, 1);
        } else {
            throw new Error(`Couldn't find experiment with id ${id}.`);
        }
    }



}

