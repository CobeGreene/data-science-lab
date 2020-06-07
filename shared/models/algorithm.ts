
export interface Algorithm {
    id: number;
    name: string;
    iteration: number;
    experimentId: number;
    isTraining: boolean;
    isFinish: boolean;
    iterationTime: number;
    pluginPackageName: string;
    pluginName: string;
}

