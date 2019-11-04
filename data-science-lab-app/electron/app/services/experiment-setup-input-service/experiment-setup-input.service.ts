
export interface ExperimentSetuptInputService {
    submit(id: number, inputs: {[id: string]: any});
    executeCommand(id: number, cmd: string);
}
