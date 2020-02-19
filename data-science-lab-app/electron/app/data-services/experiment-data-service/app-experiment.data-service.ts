import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { ExperimentDataService } from './experiment.data-service';
import { Experiment } from '../../../../shared/models';
import { SettingsContext } from '../../contexts/settings-context';
import { IdGenerator } from '../../data-structures';

export class AppExperimentDataService extends Service implements ExperimentDataService {
    private readonly key = 'experiments';

    private experiments: Experiment[];
    private idGenerator: IdGenerator;

    get context(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.experiments = [];
        this.idGenerator = new IdGenerator();
    }

    configure() {

    }

    private save() {

    }

    all() {
        return this.experiments;
    }

    get(id: number) {
        const find = this.experiments.find(value => value.id === id);
        if (find === undefined) {
            throw new Error(`Couldn't find experiment with id ${id}.`);
        }
        return find;
    }

    delete(id: number) {
        const find = this.experiments.findIndex((value) => value.id === id);
        if (find < 0) {
            throw new Error(`Couldn't find experiment with id ${id}.`);
        }
        this.experiments.splice(find, 1);
        this.save();
    }

    post(experiment: Experiment): Experiment {
        experiment.id = this.idGenerator.next();
        this.experiments.push(experiment);
        this.save();
        return experiment;
    }

    update(experiment: Experiment) {
        const find = this.experiments.findIndex((value) => value.id === experiment.id);
        if (find < 0) {
            throw new Error(`Couldn't find experiment with id ${experiment.id}.`);
        }
        this.experiments.splice(find, 1, experiment);
        this.save();
    }
}


