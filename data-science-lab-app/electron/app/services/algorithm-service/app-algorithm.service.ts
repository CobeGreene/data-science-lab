import { AlgorithmService } from './algorithm.service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { ExperimentAlgorithmDataService } from '../../data-services';
import { AlgorithmProducer } from '../../producers';
import { RecorderService } from 'data-science-lab-core';
import { AlgorithmRecorderService } from '../../core-services';


export class AppAlgorithmService implements AlgorithmService {

    constructor(private serviceContainer: ServiceContainer) {

    }


    all(): void {
        const algorithmsDataService =
            this.serviceContainer.resolve<ExperimentAlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);
        const algorithms = algorithmsDataService.all();

        const producer = this.serviceContainer.resolve<AlgorithmProducer>(SERVICE_TYPES.AlgorithmProducer);

        producer.all(algorithms);
    }

    delete(id: number): void {
        const algorithmsDataService =
            this.serviceContainer.resolve<ExperimentAlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);

        const algorithm = algorithmsDataService.read(id);
        if (algorithm.hasStarted) {
            algorithm.stop();
        }

        algorithmsDataService.delete(id);

        const producer = this.serviceContainer.resolve<AlgorithmProducer>(SERVICE_TYPES.AlgorithmProducer);
        producer.delete(id);
    }

    start(id: number): void {
        const algorithmsDataService =
            this.serviceContainer.resolve<ExperimentAlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);

        const algorithm = algorithmsDataService.read(id);

        if (!algorithm.hasStarted) {
            const recorder = this.serviceContainer.resolve<AlgorithmRecorderService>(SERVICE_TYPES.RecorderService);
            recorder.setAlgorithmId(algorithm.id);
            algorithm.start(recorder);
            const producer = this.serviceContainer.resolve<AlgorithmProducer>(SERVICE_TYPES.AlgorithmProducer);
            producer.update(algorithm);
        }
    }

    stop(id: number): void {
        const algorithmsDataService =
            this.serviceContainer.resolve<ExperimentAlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);

        const algorithm = algorithmsDataService.read(id);

        if (algorithm.hasStarted) {
            algorithm.stop();
            const producer = this.serviceContainer.resolve<AlgorithmProducer>(SERVICE_TYPES.AlgorithmProducer);
            producer.update(algorithm);
        }
    }


}


