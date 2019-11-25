import { ExperimentDataGroupDataService } from './experiment-data-group.data-service';
import { ExperimentDataGroup } from '../../models';

export class AppExperimentDataGroupDataService implements ExperimentDataGroupDataService {
    
    private dataGroups: ExperimentDataGroup[];
    private nextId: number;

    constructor() {
        this.dataGroups = [];
        this.nextId = 1;
    }
    
    all(experimentId?: number): ExperimentDataGroup[] {
        if (experimentId) {
            return this.dataGroups.filter((value) => {
                return value.experimentId === experimentId;
            });
        } else {
            return this.dataGroups;
        }
    }    
    
    create(dataGroup: ExperimentDataGroup): ExperimentDataGroup {
        dataGroup.id = this.nextId++;
        this.dataGroups.push(dataGroup);
        return dataGroup;
    }
    
    read(id: number): ExperimentDataGroup {
        const find = this.dataGroups.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find experiment data group with id ${id}`);
    }
    
    update(dataGroup: ExperimentDataGroup): void {
        const findIndex = this.dataGroups.findIndex((value) => {
            return value.id === dataGroup.id;
        });
        if (findIndex >= 0) {
            this.dataGroups[findIndex] = dataGroup;
        } else {
            throw new Error(`Couldn't find experiment data group with id ${dataGroup.id}.`);
        }
    }
    
    delete(id: number): void {
        const findIndex = this.dataGroups.findIndex((value) => {
            return value.id === id;
        });
        if (findIndex >= 0) {
            this.dataGroups.splice(findIndex, 1);
        } else {
            throw new Error(`Couldn't find experiment data group with id ${id}.`);
        }
    }
    
    deleteByExperiment(experimentId: number): void {
        this.dataGroups.filter((value) => {
            return value.experimentId === experimentId;
        }).map((value) => {
            return value.id;
        }).forEach((value) => {
            this.delete(value);
        });
    }
}
