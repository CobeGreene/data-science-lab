import { AlgorithmSessionOptionsService  } from './algorithm-session-options.service';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';


export class MockAlgorithmSessionOptionsService implements AlgorithmSessionOptionsService {
    all: () => void;
    
    create: (dataGroupId: number, plugin: AlgorithmPluginViewModel, inputs: { [id: string]: number[]; }) => void;

    executeCommand: (dataGroupId: number, command: string) => void;


    submitOptions: (dataGroupId: number, inputs: { [id: string]: any; }) => void;

    delete: (dataGroupId: number) => void;

    constructor() {
        this.reset();
    }

    reset() {
        this.all = (): void => {};
        this.create = (): void => {};
        this.delete = (): void => {};
        this.executeCommand = (): void => {};
        this.submitOptions = (): void => {};
    }



    
}
