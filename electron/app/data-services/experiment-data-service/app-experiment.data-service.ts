import { Service, ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { ExperimentDataService } from './experiment.data-service';
import { Experiment, ExperimentState } from '../../../../shared/models';
import { SettingsContext } from '../../contexts/settings-context';
import { IdGenerator } from '../../data-structures';
import { SystemError, ErrorTypes } from '../../../../shared/errors';

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
        this.experiments = this.context.get<Experiment[]>(this.key, []);
        this.experiments.forEach((value) => {
            value.state = ExperimentState.Unloaded;
        });

        const id = this.experiments.length > 0 ?
            Math.max(...this.experiments.map(value => value.id)) + 1 : 1;

        this.idGenerator = new IdGenerator(id);
    }

    private save() {
        this.context.set(this.key, this.experiments);
    }

    all() {
        return this.experiments;
    }

    get(id: number) {
        const find = this.experiments.find(value => value.id === id);
        if (find === undefined) {
            throw this.notFound(id); 
        } 
        return find;
    }

    delete(id: number) {
        const find = this.experiments.findIndex((value) => value.id === id);
        if (find < 0) {
            throw this.notFound(id); 
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
            throw this.notFound(experiment.id); 
        }
        this.experiments.splice(find, 1, experiment);
        this.save();
    }

    notFound(id: number): SystemError {
        return {
            header: 'Experiment Data Service',
            description: `Couldn't find experiment with id ${id}.`,
            type: ErrorTypes.Error
        };        
    }
}


