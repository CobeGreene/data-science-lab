import { Plugin } from '../../../../shared/models';

export interface FetchService {

    all(): void;
    create(experimentId: number, plugin: Plugin);   
    executeCommand(experimentId: number, command: string);
    submitOptions(experimentId: number, inputs: { [id: string]: any; }): void;
    delete(experimentId: number);
}
