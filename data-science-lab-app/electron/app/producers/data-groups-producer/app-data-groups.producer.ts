import { DataGroupsProducers } from './data-groups.producer';
import { BaseProducer } from '../base.producer';
import { ExperimentDataGroup, DataGroupSettings } from '../../models';
import { IpcService } from '../../../../shared/services';
import { SERVICE_TYPES } from '../../services-container';
import { ExperimentsEvents } from '../../../../shared/events';
import { DataGroupViewModel } from '../../../../shared/view-models';
import { DataGroupConverter } from '../../converters';

export class AppDataGroupsProducer extends BaseProducer implements DataGroupsProducers {


    all(experimentDataGroups: ExperimentDataGroup[], dataGroupSettings: DataGroupSettings) {
        const viewModels: DataGroupViewModel[] = [];
        const converter = this.serviceContainer.resolve<DataGroupConverter>(SERVICE_TYPES.DataGroupConverter);
        for (const dataGroup of experimentDataGroups) {
            viewModels.push(converter.toViewModel(dataGroup, dataGroupSettings));
        }
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.GetAllDataGroupsListeners, viewModels);
    }


    delete(id: number): void {
        const ipc = this.serviceContainer.resolve<IpcService>(SERVICE_TYPES.IpcService);
        ipc.send(ExperimentsEvents.DeleteDataGroupListeners, id);
    }


}
