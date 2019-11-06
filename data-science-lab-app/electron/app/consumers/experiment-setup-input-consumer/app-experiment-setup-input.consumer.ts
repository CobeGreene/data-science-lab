import { ExperimentSetupInputConsumer } from './experiment-setup-input.consumer';
import { ExperimentSetuptInputService } from '../../services/experiment-setup-input-service/experiment-setup-input.service';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

export class AppExperimentSetupInputConsumer implements ExperimentSetupInputConsumer {

    private experimentSetupInputService: ExperimentSetuptInputService;
    private ipcService: IpcService;

    constructor(experimentSetupInputService: ExperimentSetuptInputService,
                ipcService: IpcService) {
        this.experimentSetupInputService = experimentSetupInputService;
        this.ipcService = ipcService;
    }

    initialize(): void {
        this.registerSubmit();
        this.registerExecuteCommand();
    }    
    
    destory(): void {
        this.unregisterSubmit();
        this.unregisterExecuteCommand();
    }

    private registerSubmit() {
        this.ipcService.on(ExperimentsEvents.SubmitEvent, this.submitEvent);
    }
    
    private unregisterSubmit() {
        this.ipcService.removeListener(ExperimentsEvents.SubmitEvent, this.submitEvent);
    }

    private submitEvent = (event, args) => {
        const id = args[0][0] as number;
        if (!id) {
            throw new Error('Submit Input Event - no id given');
        }
        const inputs = args[0][1] as {[id: string]: any};
        if (!inputs) {
            throw new Error('Submit Input Event - no input given');
        }
        this.experimentSetupInputService.submit(id, inputs);
    }

    private registerExecuteCommand() {
        this.ipcService.on(ExperimentsEvents.ExecuteCommandEvent, this.executeCommandEvent);
    }

    private unregisterExecuteCommand() {
        this.ipcService.removeListener(ExperimentsEvents.ExecuteCommandEvent, this.executeCommandEvent);
    }

    private executeCommandEvent = (event, args) => {
        const id = args[0][0] as number;
        if (!id) {
            throw new Error('Execute Command Event - no id given');
        }
        const cmd = args[0][1] as string;
        if (!cmd) {
            throw new Error('Execute Command Event - no input given');
        }
        this.experimentSetupInputService.executeCommand(id, cmd);
    }
}