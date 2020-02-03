import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { VisualizationPluginViewModel } from '../../../../shared/view-models';
import { DataVisualizationService } from '../../services';

export class AppDataVisualizationSessionConsumer implements Consumer {
    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllVisualizationDataSessionsEvent, this.getAllEvent);
        ipcService.on(ExperimentsEvents.ExecuteCommandVisualizationDataSessionEvent, this.executeCommandEvent);
        ipcService.on(ExperimentsEvents.SubmitOptionsVisualizationDataSessionEvent, this.submitEvent);
        ipcService.on(ExperimentsEvents.DeleteVisualizationDataSessionEvent, this.deleteEvent);
        ipcService.on(ExperimentsEvents.CreateVisualizationDataSessionEvent, this.createEvent);
    }

    private getAllEvent = (_event, _arg): void => {
        const service = this.serviceContainer.resolve<DataVisualizationService>(SERVICE_TYPES.DataVisualizationService);
        service.all();
    }

    private createEvent = (_event, id: number, plugin: VisualizationPluginViewModel, inputs: { [id: string]: number[] }): void => {
        const service = this.serviceContainer.resolve<DataVisualizationService>(SERVICE_TYPES.DataVisualizationService);
        service.create(id, plugin, inputs);
    }

    private deleteEvent = (_event, id: number): void => {
        const service = this.serviceContainer.resolve<DataVisualizationService>(SERVICE_TYPES.DataVisualizationService);
        service.delete(id);
    }

    private submitEvent = (_event, id: number, inputs: { [id: string]: any }): void => {
        const service = this.serviceContainer.resolve<DataVisualizationService>(SERVICE_TYPES.DataVisualizationService);
        service.submitOptions(id, inputs);
    }

    private executeCommandEvent = (_event, id: number, command: string): void => {
        const service = this.serviceContainer.resolve<DataVisualizationService>(SERVICE_TYPES.DataVisualizationService);
        service.executeCommand(id, command);
    }

    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllVisualizationDataSessionsEvent, this.getAllEvent);
        ipcService.removeListener(ExperimentsEvents.ExecuteCommandVisualizationDataSessionEvent, this.executeCommandEvent);
        ipcService.removeListener(ExperimentsEvents.SubmitOptionsVisualizationDataSessionEvent, this.submitEvent);
        ipcService.removeListener(ExperimentsEvents.DeleteVisualizationDataSessionEvent, this.deleteEvent);
        ipcService.removeListener(ExperimentsEvents.CreateVisualizationDataSessionEvent, this.createEvent);
    }
}
