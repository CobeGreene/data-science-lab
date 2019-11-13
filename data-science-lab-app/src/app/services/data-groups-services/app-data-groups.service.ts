import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { DataGroupsService } from './data-groups.service';
import { DataGroupViewModel } from '../../../../shared/view-models';
import { IpcService } from '../../../../shared/services';
import { ExperimentsEvents } from '../../../../shared/events';


@Injectable()
export class AppDataGroupsService extends DataGroupsService implements OnDestroy {

    private dataGroups: DataGroupViewModel[];

    constructor(private ipcService: IpcService, private zone: NgZone) {
        super();

        this.dataGroups = [];
        this.registerEvents();
        this.ipcService.send(ExperimentsEvents.GetAllDataGroupsEvent);
    }

    registerEvents() {
        this.ipcService.on(ExperimentsEvents.GetAllDataGroupsListeners, this.getAllEvent);    
        this.ipcService.on(ExperimentsEvents.DeleteDataGroupListeners, this.deletedEvent);
        this.ipcService.on(ExperimentsEvents.UpdatedDataGroupListeners, this.updatedEvent);
    }


    updatedEvent = (event, dataGroup: DataGroupViewModel) => {
        this.zone.run(() => {
            const findIndex = this.dataGroups.findIndex((value) => {
                return value.id === dataGroup.id;
            });
            if (findIndex >= 0) {
                this.dataGroups[findIndex] = dataGroup;
            }
            this.updatedDataGroup.next(dataGroup);
        });
    }

    deletedEvent = (event, id: number) => {
        this.zone.run(() => {
            const findIndex = this.dataGroups.findIndex((value) => {
                return value.id === id;
            });
            if (findIndex >= 0) {
                this.dataGroups.splice(findIndex, 1);
            }
            this.deletedDataGroup.next(id);
        });
    }

    getAllEvent = (event, dataGroups: DataGroupViewModel[]) => {
        this.zone.run(() => {
            this.dataGroups = dataGroups;
        });
    }

    ngOnDestroy() {
        this.ipcService.removeListener(ExperimentsEvents.GetAllDataGroupsListeners, this.getAllEvent);    
        this.ipcService.removeListener(ExperimentsEvents.DeleteDataGroupListeners, this.deletedEvent);
        this.ipcService.removeListener(ExperimentsEvents.UpdatedFetchSessionListeners, this.updatedEvent);
    }

    all(experimentId: number): DataGroupViewModel[] {
        const experimentDataGroups = this.dataGroups.filter((value) => {
            return value.experimentId === experimentId;
        });
        return experimentDataGroups;
    }

    get(id: number): DataGroupViewModel {
        const find = this.dataGroups.find((value) => {
            return value.id === id;
        });

        if (find) {
            return find;
        }
        throw new Error(`Couldn't find data group with id ${id}.`);
    }

    delete(id: number) {
        this.ipcService.send(ExperimentsEvents.DeleteDataGroupEvent, id);
    }
}
