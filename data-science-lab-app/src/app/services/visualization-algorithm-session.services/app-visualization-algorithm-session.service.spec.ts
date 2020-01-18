import { MockZone } from '../mock-zone';
import { AppVisualizationAlgorithmSessionService } from './app-visualization-algorithm-session.service';
import { VisualizationPluginViewModel, VisualizationSessionViewModel } from '../../../../shared/view-models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';
import { OptionList } from 'data-science-lab-core';
import { Plugin } from '../../../../shared/models';

describe('Angular App Visualization Algorithm Session Service Tests', () => {

    let visualizationAlgorithmSessionService: AppVisualizationAlgorithmSessionService;
    let ipcService: MockIpcService;
    let visualizationSessions: VisualizationSessionViewModel[];
    let zone: MockZone;
    let createVisualizationSession: VisualizationSessionViewModel;

    const getAllEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.GetAllVisualizationAlgorithmSessionsListeners, visualizationSessions);
    };

    const createEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.CreateVisualizationAlgorithmSessionListeners,
            createVisualizationSession);
    };

    beforeAll(() => {
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        visualizationSessions = [
            new VisualizationSessionViewModel({
                id: 1, optionList: new OptionList()
            }),
            new VisualizationSessionViewModel({
                id: 2, optionList: new OptionList()
            }),
            new VisualizationSessionViewModel({
                id: 3, optionList: new OptionList()
            }),
            new VisualizationSessionViewModel({
                id: 4, optionList: new OptionList()
            }),
        ];
        ipcService.on(ExperimentsEvents.GetAllVisualizationAlgorithmSessionsEvent, getAllEvent);
        ipcService.on(ExperimentsEvents.CreateVisualizationAlgorithmSessionEvent, createEvent);
        visualizationAlgorithmSessionService = new AppVisualizationAlgorithmSessionService(ipcService, zone);
    });

    afterEach(() => {
        visualizationAlgorithmSessionService.ngOnDestroy();
        ipcService.removeListenersFromAllChannels();
    });

    it('get should throw for not found', () => {
        expect(() => {
            visualizationAlgorithmSessionService.get(404);
        }).toThrowError();
    });

    it('get should return first session', () => {
        const session = visualizationAlgorithmSessionService.get(1);
        expect(session.id).toBe(1);
    });

    it('has session should return false for not found', () => {
        expect(visualizationAlgorithmSessionService.hasSession(404)).toBeFalsy();
    });

    it('has session should return true for first session', () => {
        expect(visualizationAlgorithmSessionService
            .hasSession(
                visualizationSessions[0].id)).toBeTruthy();
    });

    it('create session should updated new session', (done) => {
        createVisualizationSession = new VisualizationSessionViewModel({
            id: 3, optionList: new OptionList()
        });
        visualizationAlgorithmSessionService.newSession.subscribe((value) => {
            expect(value.id).toBe(3);
            done();
        });
        visualizationAlgorithmSessionService.create(3,
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'classname', description: 'descrption',
                                     type: 'fetch'})
            }), {});
    });

    it('delete should call delete visualization session event', (done) => {
        ipcService.on(ExperimentsEvents.DeleteVisualizationAlgorithmSessionEvent, (event, id) => {
            expect(id).toBe(1);
            done();
        });
        visualizationAlgorithmSessionService.delete(1);
    });

    it('delete listeners should call delete subject', (done) => {
        visualizationAlgorithmSessionService.sessionDeleted.subscribe((dataGroupId) => {
            expect(dataGroupId).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.DeleteVisualizationAlgorithmSessionListeners, 1);
    });

    it('finish listeners should call session finish subject', (done) => {
        visualizationAlgorithmSessionService.sessionFinished.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.FinishedVisualizationAlgorithmSessionListeners, 1);
    });

    it('update listeners should update subject', (done) => {
        visualizationAlgorithmSessionService.sessionUpdated.subscribe((value) => {
            expect(value.id).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.UpdatedVisualizationAlgorithmSessionListeners, new VisualizationSessionViewModel({
            id: 1, optionList: new OptionList()
        }));
    });

    it('submit should send options', (done) => {
        ipcService.on(ExperimentsEvents.SubmitOptionsVisualizationAlgorithmSessionEvent, (event, id, inputs) => {
            expect(id).toBe(1);
            done();
        });
        visualizationAlgorithmSessionService.submitOptions(1, {});
    });

    it('execute command should send command', (done) => {
        ipcService.on(ExperimentsEvents.ExecuteCommandVisualizationAlgorithmSessionEvent, (event, id, command) => {
            expect(command).toEqual('cmd');
            done();
        });
        visualizationAlgorithmSessionService.executeCommand(1, 'cmd');
    });


});

