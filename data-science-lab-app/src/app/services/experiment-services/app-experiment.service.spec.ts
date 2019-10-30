import { MockZone } from '../mock-zone';
import { AppExperimentService } from './app-experiment.service';
import { Experiment, ExperimentList, ExperimentSelectFetchStage } from '../../../../shared/models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';

describe('Angular App Experiment Service Tests', () => {

    let experimentService: AppExperimentService;
    let ipcService: MockIpcService;
    let experimentList: ExperimentList;
    let zone: MockZone;

    const getAllEvent = (event, arg): void => {
        const json = JSON.stringify(experimentList);
        ipcService.send(ExperimentsEvents.GetAllListeners, json);
    };

    const createEvent = (event, arg): void => {
        let max = 1;
        experimentList.experiments.forEach((element) => {
            if (element.id >= max) {
                max = element.id + 1;
            }
        });
        const experiment = new ExperimentSelectFetchStage({ id: max });
        experimentList.experiments.push(experiment);
        ipcService.send(ExperimentsEvents.GetAllListeners, JSON.stringify(experimentList));
        ipcService.send(ExperimentsEvents.CreateListeners, JSON.stringify(experiment));
    };

    beforeAll(() => {
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        experimentList = new ExperimentList([
            new ExperimentSelectFetchStage({ id: 1 })
        ]);
        ipcService.on(ExperimentsEvents.GetAllEvent, getAllEvent);
        ipcService.on(ExperimentsEvents.CreateEvent, createEvent);
        experimentService = new AppExperimentService(ipcService, zone);
    });

    afterEach(() => {
        ipcService.removeListenersFromAllChannels();
        experimentService.ngOnDestroy();
    });

    it('all should call experiments changed', (done) => {
        experimentService.experimentsChanged.subscribe((value: ExperimentList) => {
            expect(value.experiments.length).toBe(experimentList.experiments.length);
            done();
        });
        experimentService.all();
    });

    it('create should call experiments changed', (done) => {
        experimentService.experimentsChanged.subscribe((value: ExperimentList) => {
            expect(value.experiments.length).toBe(experimentList.experiments.length);
            done();
        });
        experimentService.create();
    });


    it('create should call experiments changed', (done) => {
        experimentService.experimentsChanged.subscribe((value: ExperimentList) => {
            expect(value.experiments.length).toBe(experimentList.experiments.length);
            done();
        });
        experimentService.create();
    });



    it('create should call new experiment', (done) => {
        experimentService.newExperiment.subscribe((value: Experiment) => {
            expect(value.id).toBe(2);
            done();
        });
        experimentService.create();
    });

    it('get should return first experiment', () => {
        experimentService.all();
        const experiment = experimentService.get(experimentList.experiments[0].id);
        expect(experiment.stage).toEqual(experimentList.experiments[0].stage);
    });

    it('get should throw an error for unknown id', () => {
        experimentService.all();
        expect(() => {
            experimentService.get(404);
        }).toThrowError();
    });

});

