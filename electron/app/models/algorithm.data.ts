import { Plugin } from '../../../shared/models';


export interface AlgorithmData {
    id: number;
    name: string;
    experimentId: number;
    plugin: Plugin;
    algorithm: string;
    isFinish: boolean;
    iteration: number;
    iterationTime: number;
}
