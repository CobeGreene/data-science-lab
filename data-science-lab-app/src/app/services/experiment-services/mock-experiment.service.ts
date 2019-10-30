import { ExperimentService } from './experiment.service';
import { Experiment, ExperimentList } from '../../../../shared/models';
import { Subject } from 'rxjs';
import { ExperimentStages } from '../../../../shared/models/experiment_stages';

export class MockExperimentService implements ExperimentService {
    public experimentsChanged: Subject<ExperimentList>;
    public newExperiment: Subject<Experiment>;

    private experimentList: ExperimentList;

    constructor() {
        this.experimentsChanged = new Subject<ExperimentList>();
        this.newExperiment = new Subject<Experiment>();

        this.experimentList = new ExperimentList();
    }

    static init(experimentList: ExperimentList): MockExperimentService {
        const service = new MockExperimentService();
        service.experimentList = experimentList;
        return service;
    }

    all(): ExperimentList {
        return this.experimentList;
    }
    
    create(): void {
        let max = 1;
        this.experimentList.experiments.forEach((value: Experiment) => {
            if (value.id > max) {
                max = value.id + 1;
            }
        });
        const experiment = new Experiment({
            id: max,
            stage: ExperimentStages.Setup_Fetch
        });

        this.experimentList.experiments.push(
            experiment
        );
        this.experimentsChanged.next(this.experimentList);
        this.newExperiment.next(experiment);
    } 
    
    get(id: number): Experiment {
        const found = this.experimentList.experiments.find((value: Experiment) => {
            return value.id === id;
        });
        if (!found) {
            throw new Error('Couldn\'t find experiment');
        } else {
            return found;
        }
    }
}
