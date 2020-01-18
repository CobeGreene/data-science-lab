import { MockZone } from '../mock-zone';
import { AppVisualizationDataSessionService } from './app-visualization-data-session.service';
import { VisualizationPluginViewModel, VisualizationSessionViewModel } from '../../../../shared/view-models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';
import { OptionList } from 'data-science-lab-core';
import { Plugin } from '../../../../shared/models';

describe('Angular App Visualization Data Session Service Tests', () => {

    let visualizationDataSessionService: AppVisualizationDataSessionService;
    let ipcService: MockIpcService;
    let visualizationSessions: VisualizationSessionViewModel[];
    let zone: MockZone;
    let createVisualizationSession: VisualizationSessionViewModel;

    const getAllEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.GetAllVisualizationDataSessionsListeners, visualizationSessions);
    };

    const createEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.CreateVisualizationDataSessionListeners,
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
        ipcService.on(ExperimentsEvents.GetAllVisualizationDataSessionsEvent, getAllEvent);
        ipcService.on(ExperimentsEvents.CreateVisualizationDataSessionEvent, createEvent);
        visualizationDataSessionService = new AppVisualizationDataSessionService(ipcService, zone);
    });

    afterEach(() => {
        visualizationDataSessionService.ngOnDestroy();
        ipcService.removeListenersFromAllChannels();
    });

    it('get should throw for not found', () => {
        expect(() => {
            visualizationDataSessionService.get(404);
        }).toThrowError();
    });

    it('get should return first session', () => {
        const session = visualizationDataSessionService.get(1);
        expect(session.id).toBe(1);
    });

    it('has session should return false for not found', () => {
        expect(visualizationDataSessionService.hasSession(404)).toBeFalsy();
    });

    it('has session should return true for first session', () => {
        expect(visualizationDataSessionService
            .hasSession(
                visualizationSessions[0].id)).toBeTruthy();
    });

    it('create session should updated new session', (done) => {
        createVisualizationSession = new VisualizationSessionViewModel({
            id: 3, optionList: new OptionList()
        });
        visualizationDataSessionService.newSession.subscribe((value) => {
            expect(value.id).toBe(3);
            done();
        });
        visualizationDataSessionService.create(3,
            new VisualizationPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'classname', description: 'descrption',
                                     type: 'fetch'})
            }), {});
    });

    it('delete should call delete visualization session event', (done) => {
        ipcService.on(ExperimentsEvents.DeleteVisualizationDataSessionEvent, (event, id) => {
            expect(id).toBe(1);
            done();
        });
        visualizationDataSessionService.delete(1);
    });

    it('delete listeners should call delete subject', (done) => {
        visualizationDataSessionService.sessionDeleted.subscribe((dataGroupId) => {
            expect(dataGroupId).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.DeleteVisualizationDataSessionListeners, 1);
    });

    it('finish listeners should call session finish subject', (done) => {
        visualizationDataSessionService.sessionFinished.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.FinishedVisualizationDataSessionListeners, 1);
    });

    it('update listeners should update subject', (done) => {
        visualizationDataSessionService.sessionUpdated.subscribe((value) => {
            expect(value.id).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.UpdatedVisualizationDataSessionListeners, new VisualizationSessionViewModel({
            id: 1, optionList: new OptionList()
        }));
    });

    it('submit should send options', (done) => {
        ipcService.on(ExperimentsEvents.SubmitOptionsVisualizationDataSessionEvent, (event, id, inputs) => {
            expect(id).toBe(1);
            done();
        });
        visualizationDataSessionService.submitOptions(1, {});
    });

    it('execute command should send command', (done) => {
        ipcService.on(ExperimentsEvents.ExecuteCommandVisualizationDataSessionEvent, (event, id, command) => {
            expect(command).toEqual('cmd');
            done();
        });
        visualizationDataSessionService.executeCommand(1, 'cmd');
    });


});

