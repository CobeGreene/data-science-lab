import { FetchSessionProducer } from './fetch-session.producer';
import { FetchSessionViewModel } from '../../../../shared/view-models';
import { FetchSession } from '../../models';
import { IpcService } from '../../../../shared/services';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';
import { BaseProducer } from '../base.producer';


export class AppFetchSessionProducer extends BaseProducer implements FetchSessionProducer {

    all(fetchSessions: FetchSession[]) {
        const viewModels: FetchSessionViewModel[] = [];
        fetchSessions.forEach(value => {
            viewModels.push(new FetchSessionViewModel({
                experimentId: value.experimentId,
                optionList: value.fetchPlugin.getOptions().options()
            }));
        });
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.GetAllFetchSessionsListeners, viewModels);
    }

    newSession(fetchSession: FetchSession) {
        const viewModel = new FetchSessionViewModel({
            experimentId: fetchSession.experimentId,
            optionList: fetchSession.fetchPlugin.getOptions().options()
        });
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.CreateFetchSessionListeners, viewModel);
    }


}
