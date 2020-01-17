import { AlgorithmPluginViewModel  } from '../../../../shared/view-models';

export interface AlgorithmSessionOptionsService {
    all(): void;
    create(dataGroupId: number, plugin: AlgorithmPluginViewModel, inputs: {[id: string]: number[]}): void;
    executeCommand(dataGroupId: number, command: string): void;
    submitOptions(dataGroupId: number, inputs: {[id: string]: any}): void;
    delete(dataGroupId: number): void;
}

