import { ExperimentSelectFetchProducer } from './experiment-select-fetch.producer';
import { IpcProducer } from '../ipc.producer';
import { IpcService } from '../../../../shared/services';
import { Plugin } from '../../../../shared/models';
import { ExperimentsEvents } from '../../../../shared/events';

export class AppExperimentSelectFetchProducer extends IpcProducer implements ExperimentSelectFetchProducer {
    
    constructor(ipcService: IpcService) {
        super(ipcService);
    }
    
    all(plugins: Plugin[]) {
        this.ipcService.send(ExperimentsEvents.GetAllFetchPluginsListener, plugins);
    }
}
