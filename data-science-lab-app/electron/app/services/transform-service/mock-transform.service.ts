import { TransformService } from './transform.service';
import { SelectTransformPlugin } from '../../../../shared/models';


export class MockTransformService implements TransformService {
    all: () => void;
    
    create: (dataGroupId: number, plugin: SelectTransformPlugin, inputs: { [id: string]: number[]; }) => void;

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
