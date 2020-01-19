import { VisualizationsProducer } from './visualizations.producer';
import { BaseProducer } from '../base.producer';
import { Visualization } from '../../../../shared/models';
import { ExperimentsEvents } from '../../../../shared/events';


export class AppVisualizationsProducer extends BaseProducer implements VisualizationsProducer {
    all(visualizations: Visualization[]): void {
        this.ipc.send(ExperimentsEvents.GetAllVisualizationsListeners, visualizations);
    }    
    
    delete(id: number): void {
        this.ipc.send(ExperimentsEvents.DeleteVisualizationsListeners, id);
    }


}
