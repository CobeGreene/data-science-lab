import { Producer } from '../producer';
import { ExperimentAlgorithm } from '../../models';


export interface AlgorithmUpdateProducer extends Producer {

    update(algorithm: ExperimentAlgorithm);
}
