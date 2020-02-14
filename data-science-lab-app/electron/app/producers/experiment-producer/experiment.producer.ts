import { Producer } from '../producer';
import { Experiment, ExperimentList } from '../../../../shared/models';

export interface ExperimentProducer extends Producer {

    all(experimentList: ExperimentList);
    newExperiment(experiment: Experiment);
    load(id: number);
}
