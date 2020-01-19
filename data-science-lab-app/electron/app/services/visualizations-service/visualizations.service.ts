import { Visualization } from '../../../../shared/models';

export interface VisualizationsService {
    all(): void;
    delete(id: number): void;
}

