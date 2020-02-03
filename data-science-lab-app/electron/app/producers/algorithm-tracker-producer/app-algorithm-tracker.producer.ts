import { AlgorithmTrackerProducer } from './algorithm-tracker.producer';
import { AlgorithmTracker } from '../../models';
import { BaseProducer } from '../base.producer';
import { AlgorithmTrackerViewModel, AlgorithmTrackerVariableViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';

export class AppAlgorithmTrackerProducer extends BaseProducer implements AlgorithmTrackerProducer {
    
    convertToViewModel(tracker: AlgorithmTracker): AlgorithmTrackerViewModel {
        return new AlgorithmTrackerViewModel({
            algorithmId: tracker.algorithmId,
            variables: tracker.variables.map((value) => {
                return new AlgorithmTrackerVariableViewModel({
                    label: value.label,
                    description: value.description,
                    values: value.values,
                    type: value.type
                });
            })
        });
    }

    newTracker(tracker: AlgorithmTracker): void {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.NewAlgorithmTrackerListeners, this.convertToViewModel(tracker));
    }    
    
    updateTracker(tracker: AlgorithmTracker): void {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.UpdatedAlgorithmTrackerListeners, this.convertToViewModel(tracker));
    }

}



