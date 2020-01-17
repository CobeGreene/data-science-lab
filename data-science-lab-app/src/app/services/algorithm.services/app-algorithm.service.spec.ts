import { MockZone } from '../mock-zone';
import { AppAlgorithmService } from './app-algorithm.service';
import { DataGroupViewModel, AlgorithmViewModel } from '../../../../shared/view-models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';


describe('Angular App Algorithm Service Tests', () => {

    let algorithmService: AppAlgorithmService;
    let ipcService: MockIpcService;
    let viewModels: AlgorithmViewModel[];
    let zone: MockZone;

    const getAllEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.GetAllAlgorithmsListeners, viewModels);
    };

    beforeAll(() => {
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        viewModels = [
            new AlgorithmViewModel({
                id: 1, experimentId: 1
            }),
            new AlgorithmViewModel({
                id: 2, experimentId: 2
            }),
            new AlgorithmViewModel({
                id: 3, experimentId: 1
            }),
        ];
        ipcService.on(ExperimentsEvents.GetAllAlgorithmsEvent, getAllEvent);
        algorithmService = new AppAlgorithmService(ipcService, zone);
    });

    afterEach(() => {
        algorithmService.ngOnDestroy();
        ipcService.removeListenersFromAllChannels();
    });


    it('get should throw for not found', () => {
        expect(() => {
            algorithmService.get(404);
        }).toThrowError();
    });

    it('get should return first algorithm', () => {
        const algorithm = algorithmService.get(1);
        expect(algorithm.experimentId).toBe(1);
    });

    it('delete should call ipcService', (done) => {
        ipcService.on(ExperimentsEvents.DeleteAlgorithmEvent, (event, id) => {
            expect(id).toBe(1);
            done();
        });
        algorithmService.delete(1);
    });

    it('start should call ipcService', (done) => {
        ipcService.on(ExperimentsEvents.StartAlgorithmEvent, (event, id) => {
            expect(id).toBe(1);
            done();
        });
        algorithmService.start(1);
    });

    it('stop should call ipcService', (done) => {
        ipcService.on(ExperimentsEvents.StopAlgorithmEvent, (event, id) => {
            expect(id).toBe(1);
            done();
        });
        algorithmService.stop(1);
    });

    it('delete listeners should call delete subject', (done) => {
        algorithmService.deletedAlgorithm.subscribe((id) => {
            expect(id).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.DeleteAlgorithmListeners, 1);
    });

    it('update listeners should update subject', (done) => {
        algorithmService.updatedAlgorithm.subscribe((dataGroup) => {
            expect(dataGroup.id).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.UpdatedAlgorithmListeners, viewModels[0]);
    });

    it('all should return a subset of algorithms', () => {
        const groups = algorithmService.all(1);
        expect(groups.length).toBe(2);
    });

    it('new listener should new the subject', (done) => {
        algorithmService.newAlgorithm.subscribe((dataGroup) => {
            expect(dataGroup.id).toBe(5);
            done();
        });
        ipcService.send(ExperimentsEvents.NewAlgorithmListeners, new AlgorithmViewModel({
            id: 5, experimentId: 3
        }));
    });

});

