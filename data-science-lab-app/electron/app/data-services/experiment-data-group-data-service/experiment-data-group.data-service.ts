import { ExperimentDataGroup } from '../../models';
import { PluginData } from 'data-science-lab-core';

export interface ExperimentDataGroupDataService {
    all(experimentId?: number): ExperimentDataGroup[];
    create(dataGroup: ExperimentDataGroup): ExperimentDataGroup;
    read(id: number): ExperimentDataGroup;
    update(dataGroup: ExperimentDataGroup): void;
    delete(id: number): void;
    deleteByExperiment(experimentId: number): void;
    getPluginData(id: number, inputs: { [id: string]: number[]; }): { [id: string]: PluginData };
    getFeatures(id: number, inputs: { [id: string]: number[]; }): { [id: string]: { label: string, type: string}[] };
    load(groups: ExperimentDataGroup[]);
}


