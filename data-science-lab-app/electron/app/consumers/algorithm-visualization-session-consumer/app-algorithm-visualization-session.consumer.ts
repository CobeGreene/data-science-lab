import { Consumer } from '../consumer';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { VisualizationPluginViewModel } from '../../../../shared/view-models';
import { AlgorithmVisualizationService } from '../../services';

export class AppAlgorithmVisualizationSessionConsumer implements Consumer {
    constructor(private serviceContainer: ServiceContainer) {

    }

    initialize(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.on(ExperimentsEvents.GetAllVisualizationAlgorithmSessionsEvent, this.getAllEvent);
        ipcService.on(ExperimentsEvents.ExecuteCommandAlgorithmSessionEvent, this.executeCommandEvent);
        ipcService.on(ExperimentsEvents.SubmitOptionsAlgorithmSessionEvent, this.submitEvent);
        ipcService.on(ExperimentsEvents.DeleteVisualizationAlgorithmSessionEvent, this.deleteEvent);
        ipcService.on(ExperimentsEvents.CreateVisualizationAlgorithmSessionEvent, this.createEvent);
    }

    private getAllEvent = (_event, _arg): void => {
        const service = this.serviceContainer.resolve<AlgorithmVisualizationService>(SERVICE_TYPES.AlgorithmVisualizationService);
        service.all();
    }

    private createEvent = (_event, id: number, plugin: VisualizationPluginViewModel, inputs: { [id: string]: number[] }): void => {
        const service = this.serviceContainer.resolve<AlgorithmVisualizationService>(SERVICE_TYPES.AlgorithmVisualizationService);
        service.create(id, plugin, inputs);
    }

    private deleteEvent = (_event, id: number): void => {
        const service = this.serviceContainer.resolve<AlgorithmVisualizationService>(SERVICE_TYPES.AlgorithmVisualizationService);
        service.delete(id);
    }

    private submitEvent = (_event, id: number, inputs: { [id: string]: any }): void => {
        const service = this.serviceContainer.resolve<AlgorithmVisualizationService>(SERVICE_TYPES.AlgorithmVisualizationService);
        service.submitOptions(id, inputs);
    }

    private executeCommandEvent = (_event, id: number, command: string): void => {
        const service = this.serviceContainer.resolve<AlgorithmVisualizationService>(SERVICE_TYPES.AlgorithmVisualizationService);
        service.executeCommand(id, command);
    }

    destory(): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.removeListener(ExperimentsEvents.GetAllVisualizationAlgorithmSessionsEvent, this.getAllEvent);
        ipcService.removeListener(ExperimentsEvents.ExecuteCommandAlgorithmSessionEvent, this.executeCommandEvent);
        ipcService.removeListener(ExperimentsEvents.SubmitOptionsAlgorithmSessionEvent, this.submitEvent);
        ipcService.removeListener(ExperimentsEvents.DeleteVisualizationAlgorithmSessionEvent, this.deleteEvent);
        ipcService.removeListener(ExperimentsEvents.CreateVisualizationAlgorithmSessionEvent, this.createEvent);
    }
}
