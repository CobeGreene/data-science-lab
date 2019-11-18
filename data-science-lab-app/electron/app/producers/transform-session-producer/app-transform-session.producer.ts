import { TransformSessionProducer } from './transform-session.producer';
import { Producer } from '../producer';
import { TransformSession, ExperimentDataGroup, DataGroupSettings } from '../../models';
import { BaseProducer } from '../base.producer';
import { TransformSessionViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';

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


    updateDataGroup(dataGroup: ExperimentDataGroup, setings: DataGroupSettings) {
        throw new Error("Method not implemented.");
    }

    newDataGroup(dataGroup: ExperimentDataGroup, setings: DataGroupSettings) {
        throw new Error("Method not implemented.");
    }

    finish(dataGroupId: number): void {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.FinishedTransformSessionListeners, dataGroupId);
    }




}

