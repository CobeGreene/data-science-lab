import { VisualizationDataService } from './visualization.data-service';
import { Visualization } from '../../../../shared/models';

export class AppVisualizationDataService implements VisualizationDataService {
    
    private visuals: Visualization[];
    private nextId: number;
    
    constructor() {
        this.visuals = [];
        this.nextId = 1;
    }
    
    all(): Visualization[] {
        return this.visuals;
    }

    create(visual: Visualization): Visualization {
        visual.id = this.nextId++;
        this.visuals.push(visual);
        return visual;
    }

    read(id: number): Visualization {
        const find = this.visuals.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find visual with id ${id}`);
    }

    update(visualization: Visualization): void {
        const findIndex = this.visuals.findIndex((value) => {
            return value.id === visualization.id;
        });
        if (findIndex >= 0) {
            this.visuals[findIndex] = visualization;
        } else {
            throw new Error(`Couldn't find visual with id ${visualization.id}`);
        }
    }

    delete(id: number): void {
        const findIndex = this.visuals.findIndex((value) => {
            return value.id === id;
        });
        if (findIndex >= 0) {
            this.visuals.splice(findIndex, 1);
        } else {
            throw new Error(`Couldn't find visual with id ${id}`);
        }
    }


}
