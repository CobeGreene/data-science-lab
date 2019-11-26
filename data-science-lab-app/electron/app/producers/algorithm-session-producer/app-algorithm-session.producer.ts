import { AlgorithmSessionProducer } from './algorithm-session.producer';
import { AlgorithmSession, ExperimentAlgorithm } from '../../models';
import { AlgorithmSessionViewModel } from '../../../../shared/view-models';
import { BaseProducer } from '../base.producer';
import { IpcService } from '../../../../shared/services';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';

export class AppAlgorithmSessionProducer extends BaseProducer implements AlgorithmSessionProducer {
    
    
    all(sessions: AlgorithmSession[]): void {
        const viewModels: AlgorithmSessionViewModel[] = [];
        sessions.forEach(value => {
            viewModels.push(this.convertToViewModel(value));
        });
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.GetAllAlgorithmSessionsListeners, viewModels);
    }    

    convertToViewModel(session: AlgorithmSession): AlgorithmSessionViewModel {
        return new AlgorithmSessionViewModel({
            dataGroupId: session.dataGroupId,
            optionList: session.algorithmPlugin.getOptions().options()
        });
    } 
    
    newSession(session: AlgorithmSession): void {
        const viewModel = this.convertToViewModel(session);
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.CreateAlgorithmSessionListeners, viewModel);
    }

    
    delete(dataGroupId: number): void {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.DeleteAlgorithmSessionListeners, dataGroupId);        
    }
    
    updateSession(session: AlgorithmSession): void {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        const viewModel = this.convertToViewModel(session);
        ipc.send(ExperimentsEvents.UpdatedDataGroupListeners, viewModel);  
    }
    
    newAlgorithm(alg: ExperimentAlgorithm): void {
        throw new Error(`Not implemented`);   
    }
    
    finish(dataGroupId: number): void {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.FinishedAlgorithmSessionListeners, dataGroupId);
    }
    


}

