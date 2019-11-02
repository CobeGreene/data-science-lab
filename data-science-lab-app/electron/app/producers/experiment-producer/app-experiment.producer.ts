import { IpcProducer } from '../ipc.producer';
import { ExperimentProducer } from './experiment.producer';
import { IpcService } from '../../../../shared/services';
import { Experiment, ExperimentList } from '../../../../shared/models';
import { ExperimentsEvents } from '../../../../shared/events';

export class AppExperimentProducer extends IpcProducer implements ExperimentProducer {

    constructor(ipcService: IpcService) {
        super(ipcService);
    }

    all(experiments: ExperimentList) {
        this.ipcService.send(ExperimentsEvents.GetAllListeners, experiments);
    }

    create(experiment: Experiment) {
        this.ipcService.send(ExperimentsEvents.CreateListeners, experiment);
    }

    update(experiment: Experiment) {
        this.ipcService.send(ExperimentsEvents.UpdatedListeners, experiment);
    }

}
