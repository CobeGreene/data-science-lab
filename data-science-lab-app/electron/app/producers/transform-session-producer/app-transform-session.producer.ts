import { TransformSessionProducer } from './transform-session.producer';
import { Producer } from '../producer';
import { TransformSession, ExperimentDataGroup, DataGroupSettings } from '../../models';
import { BaseProducer } from '../base.producer';
import { TransformSessionViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';
import { DataGroupConverter } from '../../converters';

export class AppTransformSessionProducer extends BaseProducer implements TransformSessionProducer {
    
    
    all(sessions: TransformSession[]): void {
        const viewModels: TransformSessionViewModel[] = [];
        sessions.forEach(value => {
            viewModels.push(this.convertToViewModel(value));
        });
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.GetAllTransformSessionsListeners, viewModels);
    }
    
    convertToViewModel(transformSession: TransformSession): TransformSessionViewModel {
        return new TransformSessionViewModel({
            dataGroupId: transformSession.dataGroupId,
            optionList: transformSession.transformPlugin.getOptions().options()
        });
    }
    
    newSession(session: TransformSession): void {
        const viewModel = this.convertToViewModel(session);
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.CreateTransformSessionListeners, viewModel);
    }


    delete(dataGroupId: number): void {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.DeleteTransformSessionListeners, dataGroupId);
    }


    updateSession(session: TransformSession): void {
        const viewModel = this.convertToViewModel(session);
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.UpdatedTransformSessionListeners, viewModel);
    }


    updateDataGroup(dataGroup: ExperimentDataGroup, settings: DataGroupSettings) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        const converter = this.serviceContainer.resolve<DataGroupConverter>(SERVICE_TYPES.DataGroupConverter);
        const viewModel = converter.toViewModel(dataGroup, settings);
        ipc.send(ExperimentsEvents.UpdatedDataGroupListeners, viewModel);  
    }

    newDataGroup(dataGroup: ExperimentDataGroup, settings: DataGroupSettings) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        const converter = this.serviceContainer.resolve<DataGroupConverter>(SERVICE_TYPES.DataGroupConverter);
        const viewModel = converter.toViewModel(dataGroup, settings);
        ipc.send(ExperimentsEvents.NewDataGroupListeners, viewModel);  
    }

    finish(dataGroupId: number): void {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.FinishedTransformSessionListeners, dataGroupId);
    }




}

