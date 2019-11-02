import { ExperimentConsumer } from './experiment.consumer';
import { ExperimentDataService } from '../../services';
import { IpcService } from '../../../../shared/services';

export class AppExperimentConsumer implements ExperimentConsumer {
    
    experimentService: ExperimentDataService;
    ipcService: IpcService;
    
    

    initialize(): void {
        throw new Error('Method not implemented.');
    }    
    
    destory(): void {
        throw new Error('Method not implemented.');
    }


}
