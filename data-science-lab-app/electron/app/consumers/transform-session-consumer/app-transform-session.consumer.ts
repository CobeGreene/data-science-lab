import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { SelectTransformPlugin } from '../../../../shared/models';
import { TransformService } from '../../services';


export class AppTransformSessionConsumer implements Consumer {

    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllTransformSessionsEvent, this.getAllEvent);
        ipcService.on(ExperimentsEvents.ExecuteCommandFetchSessionEvent, this.executeCommandEvent);
        ipcService.on(ExperimentsEvents.SubmitOptionsTransformSessionEvent, this.submitEvent);
        ipcService.on(ExperimentsEvents.DeleteTransformSessionEvent, this.deleteEvent);
        ipcService.on(ExperimentsEvents.CreateTransformSessionEvent, this.createEvent);
    }

    private getAllEvent = (_event, _arg): void => {
        const service = this.serviceContainer.resolve<TransformService>(SERVICE_TYPES.TransformService);
        service.all();
    }

    private createEvent = (_event, dataGroupId: number, plugin: SelectTransformPlugin, inputs: {[id: string]: number[]}): void => {
        const service = this.serviceContainer.resolve<TransformService>(SERVICE_TYPES.TransformService);
        service.create(dataGroupId, plugin, inputs);
    }

    private deleteEvent = (_event, dataGroupId: number): void => {
        const service = this.serviceContainer.resolve<TransformService>(SERVICE_TYPES.TransformService);
        service.delete(dataGroupId);
    }

    private submitEvent = (_event, dataGroupId: number, inputs: {[id: string]: any}): void => {
        const service = this.serviceContainer.resolve<TransformService>(SERVICE_TYPES.TransformService);
        service.submitOptions(dataGroupId, inputs);
    }

    private executeCommandEvent = (_event, dataGroupId: number, command: string): void => {
        const service = this.serviceContainer.resolve<TransformService>(SERVICE_TYPES.TransformService);
        service.executeCommand(dataGroupId, command);
    }


    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllTransformSessionsEvent, this.getAllEvent);
        ipcService.removeListener(ExperimentsEvents.ExecuteCommandFetchSessionEvent, this.executeCommandEvent);
        ipcService.removeListener(ExperimentsEvents.SubmitOptionsTransformSessionEvent, this.submitEvent);
        ipcService.removeListener(ExperimentsEvents.DeleteTransformSessionEvent, this.deleteEvent);
        ipcService.removeListener(ExperimentsEvents.CreateTransformSessionEvent, this.createEvent);
    }


}

