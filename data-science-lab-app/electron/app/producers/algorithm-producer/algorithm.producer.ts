import { AlgorithmViewModel } from '../../../../shared/view-models';
import { ExperimentAlgorithm } from '../../models';
import { Producer } from '../producer';


export interface AlgorithmProducer extends Producer {
 
    all(algorithms: ExperimentAlgorithm[]);
    delete(id: number): void;
    update(algorithm: ExperimentAlgorithm);
    
}
