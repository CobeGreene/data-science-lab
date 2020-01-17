import { ExperimentDataGroupDataService } from './experiment-data-group.data-service';
import { ExperimentDataGroup } from '../../models';
import { PluginData } from 'data-science-lab-core';


export class MockExperimentDataGroupDataService implements ExperimentDataGroupDataService {
    all: (experimentId?: number) => ExperimentDataGroup[];


    create: (dataGroup: ExperimentDataGroup) => ExperimentDataGroup;

    read: (id: number) => ExperimentDataGroup;


    update: (dataGroup: ExperimentDataGroup) => void;


    delete: (id: number) => void;

    deleteByExperiment: (experimentId: number) => void;

    getPluginData: (id: number, inputs: { [id: string]: number[]; }) => { [id: string]: PluginData };
    
    getFeatures: (id: number, inputs: { [id: string]: number[]; }) => { [id: string]: { label: string, type: string}[] };

    constructor() {
        this.reset();
    }

    reset() {
        this.all = (): ExperimentDataGroup[] => { throw new Error(`Not Implemented`); }
        this.create = () => { throw new Error(`Not implemented`); };
        this.read = () => { throw new Error(`Not implemented`); };
        this.update = () => { };
        this.delete = () => { };
        this.deleteByExperiment = () => { };
        this.getPluginData = () => {throw new Error(`Not implemented`);};
        this.getFeatures = () => {throw new Error(`Not implemented`);};
    }

}
