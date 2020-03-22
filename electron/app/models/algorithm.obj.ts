import { Plugin } from '../../../shared/models';
import { AlgorithmPlugin } from 'data-science-lab-core';
import { AlgorithmRecorderService } from '../core-services/recorder-service';

export interface AlgorithmObject {
    id: number;
    name: string;
    experimentId: number;
    plugin: Plugin;
    algorithm: AlgorithmPlugin;
    isTraining: boolean;
    isFinish: boolean;
    iterationTime: number;
    iteration: number;
    recorder?: AlgorithmRecorderService;
    trainer?: NodeJS.Timer;
}
