import { ExperimentAlgorithm } from '../../models';


export interface ExperimentAlgorithmDataService {
    all(experimentId?: number): ExperimentAlgorithm[];
    create(algorithm: ExperimentAlgorithm): ExperimentAlgorithm;
    read(id: number): ExperimentAlgorithm;
    update(algorithm: ExperimentAlgorithm): void;
    delete(id: number): void;
    deleteByExperiment(experimentId: number): void;
}
