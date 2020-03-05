import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { ServiceModelRoutes, Producer, } from '../../pipeline';
import { ExperimentEvents, AlgorithmEvents } from '../../../../shared/events';
import { ServiceModel } from '../service-model';
import { AlgorithmDataService } from '../../data-services/algorithm-data-service';


export class AlgorithmServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.AlgorithmServiceModel,
        routes: [
            { path: AlgorithmEvents.All, method: 'all' },
            { path: AlgorithmEvents.Change, method: 'change', isListener: true },
            { path: AlgorithmEvents.Delete, method: 'delete' },
            { path: AlgorithmEvents.Start, method: 'start' },
            { path: AlgorithmEvents.Stop, method: 'stop' },
            { path: AlgorithmEvents.Update, method: 'update' },
        ]
    };

    private algorithmService: AlgorithmDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.algorithmService = serviceContainer.resolve<AlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);
    }

    all() {
        this.producer.send(AlgorithmEvents.All, this.algorithmService.allView());
    }

    change(id: number) {
        const algorithm = this.algorithmService.view(id);
        this.producer.send(AlgorithmEvents.Update, algorithm);
    }

    delete(id: number) {
        this.algorithmService.delete(id);
        this.producer.send(AlgorithmEvents.Delete, id);
    }

    start(id: number) {
        this.algorithmService.start(id);
        this.producer.send(AlgorithmEvents.Update, this.algorithmService.view(id));
    }

    stop(id: number) {
        this.algorithmService.stop(id);
        this.producer.send(AlgorithmEvents.Update, this.algorithmService.view(id));
    }

    update(id: number, name: string, time: number) {
        const obj = this.algorithmService.get(id);
        obj.name = name;
        if (obj.iterationTime === time && obj.isTraining) {
            this.algorithmService.stop(id);
            obj.iterationTime = time;
            this.algorithmService.update(obj);
            this.algorithmService.start(id);
        } else {
            this.algorithmService.update(obj);
        }
        this.producer.send(AlgorithmEvents.Update, this.algorithmService.view(id));
    }
}
