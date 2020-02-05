import { AlgorithmVisualizationSessionProducer } from './algorithm-visualization-session.producer';
import { VisualizationSession } from '../../models';
import { BaseProducer } from '../base.producer';
import { VisualizationSessionViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';
import { Visualization  } from '../../../../shared/models';

export class AppAlgorithmVisualizationSessionProducer extends BaseProducer implements AlgorithmVisualizationSessionProducer {
    
    all(sessions: VisualizationSession[]): void {
        const viewModels: VisualizationSessionViewModel[] = [];
        
        sessions.forEach(value => {
            viewModels.push(this.convertToViewModel(value));
        });

        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.GetAllVisualizationAlgorithmSessionsListeners, viewModels);
    } 
    
    convertToViewModel(session: VisualizationSession): VisualizationSessionViewModel {
        return new VisualizationSessionViewModel({
            id: session.id,
            optionList: session.visualizationPlugin.getOptions().options()
        });
    }

    newSession(session: VisualizationSession): void {
        const viewModel = this.convertToViewModel(session);
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.CreateVisualizationAlgorithmSessionListeners, viewModel);
    }
    
    delete(id: number): void {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.DeleteVisualizationAlgorithmSessionListeners, id);
    }
    
    updateSession(session: VisualizationSession): void {
        const viewModel = this.convertToViewModel(session);
        this.ipc.send(ExperimentsEvents.UpdatedVisualizationAlgorithmSessionListeners, viewModel);
    }
    
    finish(id: number): void {
        this.ipc.send(ExperimentsEvents.FinishedVisualizationAlgorithmSessionListeners, id);
    }
    
    newVisualization(visual: Visualization): void {
        this.ipc.send(ExperimentsEvents.NewVisualizationsListeners, visual);
    }
}

