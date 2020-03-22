import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { ServiceModelRoutes, Producer, } from '../../pipeline';
import { ExperimentEvents } from '../../../../shared/events';
import { ServiceModel } from '../service-model';
import { ExperimentDataService } from '../../data-services/experiment-data-service';
import { Experiment, ExperimentState } from '../../../../shared/models';

export class ExperimentServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.ExperimentServiceModel,
        routes: [
            { path: ExperimentEvents.All, method: 'all' },
            { path: ExperimentEvents.Create, method: 'create' },
            { path: ExperimentEvents.Delete, method: 'delete' },
            { path: ExperimentEvents.Update, method: 'update' },
            { path: ExperimentEvents.Load, method: 'load' },
        ]
    };

    private dataService: ExperimentDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);
        this.dataService = serviceContainer.resolve<ExperimentDataService>(SERVICE_TYPES.ExperimentDataService);
    }

    all() {
        this.producer.send(ExperimentEvents.All, this.dataService.all());
    }

    create(title: string, description?: string) {
        let experiment: Experiment = {
            id: 0,
            title,
            description,
            created: new Date(),
            state: ExperimentState.Loaded
        };
        experiment = this.dataService.post(experiment);
        this.producer.send(ExperimentEvents.Create, experiment);
    }

    update(id: number, title: string, description?: string) {
        const experiment = this.dataService.get(id);
        
        experiment.title = title;
        experiment.description = description;

        this.dataService.update(experiment);
        this.producer.send(ExperimentEvents.Update, experiment);
    }

    delete(id: number) {
        this.dataService.delete(id);
        this.producer.send(ExperimentEvents.Delete, id);
    }

    load(id: number) {
        const experiment = this.dataService.get(id);
        if (experiment.state === ExperimentState.Unloaded) {
            experiment.state = ExperimentState.Loaded;
            this.dataService.update(experiment);
            this.producer.send(ExperimentEvents.Load, experiment);
        }
    }

}
