import { ExperimentDataService } from './experiment.data-service';
import { Experiment, ExperimentList } from '../../../../shared/models';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { DocumentContext } from '../../contexts';

export class AppExperimentDataService implements ExperimentDataService {
    
    readonly EXPERIMENT_LIST = 'experiment-list';

    private experimentList: ExperimentList;
    private nextId: number;

    constructor(private serviceContainer: ServiceContainer) {
        const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
        this.experimentList = context.get<ExperimentList>(this.EXPERIMENT_LIST, new ExperimentList());
        
        this.nextId = this.experimentList.experiments.length > 0 ? 
            Math.max(...this.experimentList.experiments.map(value => value.id)) + 1 : 1;

        this.experimentList.experiments.forEach((value) => {
            value.isLoaded = false;
        });
    }

    private saveExperiments(): void {
        const context = this.serviceContainer.resolve<DocumentContext>(SERVICE_TYPES.DocumentContext);
        context.set(this.EXPERIMENT_LIST, this.experimentList); 
    }
    
    all(): ExperimentList {
        return this.experimentList;
    }    
    
    create(experiment: Experiment): Experiment {
        experiment.id = this.nextId++;
        this.experimentList.experiments.push(experiment);
        this.saveExperiments();
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
        this.saveExperiments();
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
        this.saveExperiments();
    }



}

