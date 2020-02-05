import { Visualization } from '../../../../shared/models';

export interface VisualizationDataService {
    all(): Visualization[];
    create(visual: Visualization): Visualization;
    read(id: number): Visualization;
    update(visualization: Visualization): void;
    delete(id: number): void;
}
