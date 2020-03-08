import { PluginData } from 'data-science-lab-core';
import { DatasetObject } from '../../models';
import { Dataset } from '../../../../shared/models';

export interface DatasetDataService {
    configure(): void;
    all(): DatasetObject[];
    // tslint:disable-next-line: unified-signatures
    all(experimentId: number): DatasetObject[];
    create(experimentId: number, data: PluginData): number[];
    get(id: number): DatasetObject;
    delete(id: number): void;
    deleteByExperiment(experimentId: number): void;
    view(id: number): Dataset;
    load(experimentId: number): void;
    save(experimentId: number): void;
    show(id: number): void;
    update(dataset: DatasetObject): void;
    split(id: number, split: number): number;
    join(ids: number[]): { updateId: number, deletedIds: number[] };
    extract(id: number, inputs: { [id: string]: number[] }, features: number[]): { [id: string]: PluginData };
    transform(id: number, pluginData: PluginData[] | PluginData, features: number[]): { updateId: number, createIds: number[] };
}
