import { TransformPluginViewModel  } from '../../../../shared/view-models';


export interface TransformService {
    all(): void;
    create(dataGroupId: number, plugin: TransformPluginViewModel, inputs: {[id: string]: number[]}): void;
    executeCommand(dataGroupId: number, command: string): void;
    submitOptions(dataGroupId: number, inputs: {[id: string]: any}): void;
    delete(dataGroupId: number): void;
}

