import { FetchSessionProducer } from './fetch-session.producer';
import { FetchSessionViewModel, DataGroupViewModel } from '../../../../shared/view-models';
import { FetchSession, ExperimentDataGroup, ApiSettings, DataGroupSettings } from '../../models';
import { IpcService } from '../../../../shared/services';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';
import { BaseProducer } from '../base.producer';
import { DataGroupConverter } from '../../converters';


export class AppFetchSessionProducer extends BaseProducer implements FetchSessionProducer {

    newDataGroup(dataGroup: ExperimentDataGroup, settings: DataGroupSettings) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        const converter = this.serviceContainer.resolve<DataGroupConverter>(SERVICE_TYPES.DataGroupConverter);
        const viewModel = converter.toViewModel(dataGroup, settings);
        ipc.send(ExperimentsEvents.NewDataGroupListeners, viewModel);        
    }
    
    all(fetchSessions: FetchSession[]) {
        const viewModels: FetchSessionViewModel[] = [];
        fetchSessions.forEach(value => {
            viewModels.push(this.convertToViewModel(value));
        });
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.GetAllFetchSessionsListeners, viewModels);
    }
    
    newSession(fetchSession: FetchSession) {
        const viewModel = this.convertToViewModel(fetchSession);
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.CreateFetchSessionListeners, viewModel);
    }
    
    delete(experimentId: number) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.DeleteFetchSessionListeners, experimentId);
    }


    updateSession(fetchSession: FetchSession) {
        const viewModel = this.convertToViewModel(fetchSession);
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.UpdatedFetchSessionListeners, viewModel);
    }

    convertToViewModel(fetchSession: FetchSession): FetchSessionViewModel {
        return new FetchSessionViewModel({
            experimentId: fetchSession.experimentId,
            optionList: fetchSession.fetchPlugin.getOptions().options()
        });
    }

    finish(experimendId: number): void {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.FinishedFetchSessionListeners, experimendId);
    }

}
