import { Producer } from '../producer';
import { AlgorithmSession, ExperimentAlgorithm } from '../../models';


export interface AlgorithmSessionProducer extends Producer {

    all(sessions: AlgorithmSession[]): void;
    newSession(sessions: AlgorithmSession): void;
    delete(dataGroupId: number): void;
    updateSession(sessions: AlgorithmSession): void;
    newAlgorithm(alg: ExperimentAlgorithm): void;
    finish(dataGroupId: number): void;

}


