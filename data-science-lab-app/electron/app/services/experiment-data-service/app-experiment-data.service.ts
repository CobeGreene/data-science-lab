import { ExperimentDataService } from './experiment-data.service';
import { ExperimentData } from '../../models';
import { ExperimentStages } from '../../../../shared/models';

export class AppExperimentDataService implements ExperimentDataService {
    
    private data: ExperimentData[]; 

    constructor() {
        this.data = [];
    }

    all(): ExperimentData[] {
        return this.data;
    }    
    
    get(id: number): ExperimentData {
        const find =  this.data.find((data) => {
            return data.id === id;
        });
        if (find) {
            return find;
        }
        return null;
    }

    create(): ExperimentData {
        let max = 1;
        this.data.forEach((value) => {
            if (value.id >= max) {
                max = value.id + 1;
            }
        });
        const newDatum = new ExperimentData({
            id: max,
            stage: ExperimentStages.Select_Fetch
        });
        this.data.push(newDatum);
        return newDatum;
    }

    delete(id: number): void {
        const index = this.data.findIndex((value) => {
            return value.id === id;
        });
        if (index < 0) {
            throw new Error('Couldn\'t find experiment data to delete');
        }
        this.data.splice(index, 1);
    }

    update(id: number, experimentData: ExperimentData) {
        const index = this.data.findIndex((value) => {
            return value.id === id;
        });
        
        if (index < 0) {
            throw new Error('Couldn\'t find experiment data to update');
        }

        this.data[index] = experimentData;
    }


}
