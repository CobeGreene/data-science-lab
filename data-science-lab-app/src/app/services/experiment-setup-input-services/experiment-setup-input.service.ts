export abstract class ExperimentSetupInputService {
    abstract executeCommand(id: number, command: string);
    abstract submit(id: number, inputs: {[id: string]: any});
}
