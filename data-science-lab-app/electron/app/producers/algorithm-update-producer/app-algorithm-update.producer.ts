import { AlgorithmUpdateProducer } from './algorithm-update.producer';
import { BaseProducer } from '../base.producer';
import { ExperimentAlgorithm } from '../../models';
import { SERVICE_TYPES } from '../../services-container';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';
import { AlgorithmViewModel } from '../../../../shared/view-models';


export class AppAlgorithmUpdateProducer extends BaseProducer implements AlgorithmUpdateProducer {
    
    update(algorithm: ExperimentAlgorithm) {
        const ipcService = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipcService.send(ExperimentsEvents.UpdatedAlgorithmListeners, new AlgorithmViewModel({
            id: algorithm.id,
            experimentId: algorithm.experimentId,
            hasStarted: algorithm.hasStarted,
            iteration: algorithm.iteration
        }));
    }
}
