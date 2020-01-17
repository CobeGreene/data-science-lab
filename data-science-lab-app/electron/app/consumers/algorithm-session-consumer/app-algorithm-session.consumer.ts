import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';
import { AlgorithmSessionOptionsService } from '../../services';

export class AppAlgorithmSessionConsumer implements Consumer {

    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllAlgorithmSessionsEvent, this.getAllEvent);
        ipcService.on(ExperimentsEvents.ExecuteCommandAlgorithmSessionEvent, this.executeCommandEvent);
        ipcService.on(ExperimentsEvents.SubmitOptionsAlgorithmSessionEvent, this.submitEvent);
        ipcService.on(ExperimentsEvents.DeleteAlgorithmSessionEvent, this.deleteEvent);
        ipcService.on(ExperimentsEvents.CreateAlgorithmSessionEvent, this.createEvent);
    }

    private getAllEvent = (_event, _arg): void => {
        const service = this.serviceContainer.resolve<AlgorithmSessionOptionsService>(SERVICE_TYPES.AlgorithmSessionOptionsService);
        service.all();
    }

    private createEvent = (_event, dataGroupId: number, plugin: AlgorithmPluginViewModel, inputs: { [id: string]: number[] }): void => {
        const service = this.serviceContainer.resolve<AlgorithmSessionOptionsService>(SERVICE_TYPES.AlgorithmSessionOptionsService);
        service.create(dataGroupId, plugin, inputs);
    }

    private deleteEvent = (_event, dataGroupId: number): void => {
        const service = this.serviceContainer.resolve<AlgorithmSessionOptionsService>(SERVICE_TYPES.AlgorithmSessionOptionsService);
        service.delete(dataGroupId);
    }

    private submitEvent = (_event, dataGroupId: number, inputs: { [id: string]: any }): void => {
        const service = this.serviceContainer.resolve<AlgorithmSessionOptionsService>(SERVICE_TYPES.AlgorithmSessionOptionsService);
        service.submitOptions(dataGroupId, inputs);
    }

    private executeCommandEvent = (_event, dataGroupId: number, command: string): void => {
        const service = this.serviceContainer.resolve<AlgorithmSessionOptionsService>(SERVICE_TYPES.AlgorithmSessionOptionsService);
        service.executeCommand(dataGroupId, command);
    }


    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllAlgorithmSessionsEvent, this.getAllEvent);
        ipcService.removeListener(ExperimentsEvents.SubmitOptionsAlgorithmSessionEvent, this.submitEvent);
        ipcService.removeListener(ExperimentsEvents.ExecuteCommandAlgorithmSessionEvent, this.executeCommandEvent);
        ipcService.removeListener(ExperimentsEvents.DeleteAlgorithmSessionEvent, this.deleteEvent);
        ipcService.removeListener(ExperimentsEvents.CreateAlgorithmSessionEvent, this.createEvent);
    }
}



