import { Injectable } from '@angular/core';
import { ExperimentSetupInputService } from './experiment-setup-input.service';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';

@Injectable()
export class AppExperimentSetupInputService implements ExperimentSetupInputService {
    
    constructor(private ipcService: IpcService) {
    }
    
    executeCommand(id: number, command: string) {
        this.ipcService.send(ExperimentsEvents.ExecuteCommandEvent, id, command);
    }

    submit(id: number, inputs: {[id: string]: any}) {
        this.ipcService.send(ExperimentsEvents.SubmitEvent, id, inputs);
    }
} 

