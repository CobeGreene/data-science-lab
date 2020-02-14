import { ExperimentProducer } from './experiment.producer';
import { Experiment, ExperimentList } from '../../../../shared/models';
import { IpcService } from '../../../../shared/services';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';
import { BaseProducer } from '../base.producer';


export class AppExperimentProducer extends BaseProducer implements ExperimentProducer {
    all(experimentList: ExperimentList) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.GetAllListeners, experimentList);
    }    
    
    newExperiment(experiment: Experiment) {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.CreateListeners, experiment);
    }

    load(id: number) {
        this.ipc.send(ExperimentsEvents.LoadExperimentListener, id);
    }

}

