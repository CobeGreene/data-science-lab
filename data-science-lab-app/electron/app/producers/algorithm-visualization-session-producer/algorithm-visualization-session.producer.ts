import { Producer } from '../producer';
import { VisualizationSession } from '../../models';
import { Visualization } from '../../../../shared/models';

export interface AlgorithmVisualizationSessionProducer extends Producer {
    all(sessions: VisualizationSession[]): void;
    newSession(session: VisualizationSession): void;
    delete(id: number): void;
    updateSession(session: VisualizationSession): void;
    finish(id: number): void;
    newVisualization(visual: Visualization): void;
}

