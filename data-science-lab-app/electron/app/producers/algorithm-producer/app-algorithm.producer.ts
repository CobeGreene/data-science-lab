import { AlgorithmProducer } from './algorithm.producer';
import { ExperimentAlgorithm} from '../../models';
import { BaseProducer } from '../base.producer';
import { AlgorithmViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';


export class AppAlgorithmProducer extends BaseProducer implements AlgorithmProducer  {


    all(algorithms: ExperimentAlgorithm[]) {
        const viewModels: AlgorithmViewModel[] = [];
        for (const algorithm of algorithms) {
            viewModels.push(this.convertToViewModel(algorithm));
        }
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.send(ExperimentsEvents.GetAllAlgorithmsListeners, viewModels);
    }    

    convertToViewModel(algorithm: ExperimentAlgorithm): AlgorithmViewModel {
        return new AlgorithmViewModel({
            id: algorithm.id,
            experimentId: algorithm.experimentId,
            hasStarted: algorithm.hasStarted,
            iteration: algorithm.iteration
        });
    }

    delete(id: number): void {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.send(ExperimentsEvents.DeleteAlgorithmListeners, id);
    }
    update(algorithm: ExperimentAlgorithm) {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.send(ExperimentsEvents.UpdatedAlgorithmListeners, this.convertToViewModel(algorithm));
    }


}

