import { Experiment, ExperimentList } from '../../../../shared/models';

export abstract class ExperimentProducer {

    abstract error(reason: any): void;
    abstract all(experiments: ExperimentList): void;
    abstract create(experiment: Experiment): void;
    abstract update(experiment: Experiment): void;
}
