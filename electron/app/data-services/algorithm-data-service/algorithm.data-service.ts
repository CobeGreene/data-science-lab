import { AlgorithmObject } from '../../models';
import { Algorithm, Plugin } from '../../../../shared/models';
import { AlgorithmPlugin, PluginData } from 'data-science-lab-core';


export interface AlgorithmDataService {
    configure(): void;
    all(): AlgorithmObject[];
    // tslint:disable-next-line: unified-signatures
    all(experimentId: number): AlgorithmObject[];
    allView(): Algorithm[];
    get(id: number): AlgorithmObject;
    create(experimentId: number, plugin: Plugin, algorithm: AlgorithmPlugin): number;
    delete(id: number): Promise<number>;
    deleteByExperiment(experimentId: number): Promise<number[]>;
    view(id: number): Algorithm;
    load(experimentId: number): Promise<void>;
    save(experimentId: number): Promise<void>;
    update(algorithm: AlgorithmObject): void;
    start(id: number): void;
    stop(id: number): void;
}


