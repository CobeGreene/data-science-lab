import { Plugin, Package } from '../../../shared/models';
import { AlgorithmPlugin } from 'data-science-lab-core';


export interface AlgorithmObject {
    id: number;
    experimentId: number;
    datasetId: number;
    plugin: Plugin;
    package: Package;
    algorithm: AlgorithmPlugin;
    isTraining: boolean;
    isFinish: boolean;
    iterationTime: number;
    trainer: NodeJS.Timer;
}
