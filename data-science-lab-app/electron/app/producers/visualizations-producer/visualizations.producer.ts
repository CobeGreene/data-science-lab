import { Producer } from '../producer';
import { Visualization } from '../../../../shared/models';

export interface VisualizationsProducer extends Producer {
    all(visualizations: Visualization[]): void;
    delete(id: number): void;
}
