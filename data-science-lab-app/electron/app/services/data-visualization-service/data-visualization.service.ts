import { VisualizationPluginViewModel } from '../../../../shared/view-models';

export interface DataVisualizationService {
    all(): void;
    create(id: number, plugin: VisualizationPluginViewModel, inputs: {[id: string]: number[]}): void;   
    executeCommand(id: number, command: string): void;
    submitOptions(id: number, inputs: {[id: string]: any}): void;
    delete(id: number): void;
}

