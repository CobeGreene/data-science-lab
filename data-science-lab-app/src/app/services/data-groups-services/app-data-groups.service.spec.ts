import { MockZone } from '../mock-zone';
import { AppDataGroupsService } from './app-data-groups.service';
import { DataGroupViewModel } from '../../../../shared/view-models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';


describe('Angular App Data Groups Service Tests', () => {

    let dataGroupService: AppDataGroupsService;
    let ipcService: MockIpcService;
    let dataGroups: DataGroupViewModel[];
    let zone: MockZone;

    const getAllEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.GetAllDataGroupsListeners, dataGroups);
    };

    beforeAll(() => {
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        dataGroups = [
            new DataGroupViewModel({
                id: 1, experimentId: 1, numOfExamples: 50, numOfFeatures: 50
            }),
            new DataGroupViewModel({
                id: 2, experimentId: 2, numOfExamples: 50, numOfFeatures: 50
            }),
            new DataGroupViewModel({
                id: 3, experimentId: 1, numOfExamples: 50, numOfFeatures: 50
            }),
        ];
        ipcService.on(ExperimentsEvents.GetAllDataGroupsEvent, getAllEvent);
        dataGroupService = new AppDataGroupsService(ipcService, zone);
    });

    afterEach(() => {
        dataGroupService.ngOnDestroy();
        ipcService.removeListenersFromAllChannels();
    });


    it('get should throw for not found', () => {
        expect(() => {
            dataGroupService.get(404);
        }).toThrowError();
    });

    it('get should return first group', () => {
        const group = dataGroupService.get(1);
        expect(group.experimentId).toBe(1);
    });

    it('delete should call ipcService', (done) => {
        ipcService.on(ExperimentsEvents.DeleteDataGroupEvent, (event, id) => {
            expect(id).toBe(1);
            done();
        });
        dataGroupService.delete(1);
    });

    it('delete listeners should call delete subject', (done) => {
        dataGroupService.deletedDataGroup.subscribe((id) => {
            expect(id).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.DeleteDataGroupListeners, 1);
    });

    it('update listeners should update subject', (done) => {
        dataGroupService.updatedDataGroup.subscribe((dataGroup) => {
            expect(dataGroup.id).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.UpdatedDataGroupListeners, dataGroups[0]);
    });

    it('all should return a subset of data groups', () => {
        const groups = dataGroupService.all(1);
        expect(groups.length).toBe(2);
    });

});

