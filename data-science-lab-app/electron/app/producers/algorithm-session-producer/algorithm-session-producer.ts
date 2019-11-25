import { Producer } from '../producer';
import { AlgorithmSession } from '../../models';


export interface AlgorithmSessionProducer extends Producer {

    all(sessions: AlgorithmSession[]): void;
    newSession(sessions: AlgorithmSession): void;
    delete(dataGroupId: number): void;
    updateSession(sessions: AlgorithmSession): void;
    newAlgorithm(): void;
    finish(dataGroupId: number): void;

}


