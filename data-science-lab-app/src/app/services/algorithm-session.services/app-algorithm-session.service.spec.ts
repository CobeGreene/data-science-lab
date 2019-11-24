import { MockZone } from '../mock-zone';
import { AppAlgorithmSessionService } from './app-algorithm-session.service';
import { AlgorithmPluginViewModel, AlgorithmSessionViewModel } from '../../../../shared/view-models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';
import { OptionList } from 'data-science-lab-core';
import { Plugin } from '../../../../shared/models';

describe('Angular App Algorithm Session Service Tests', () => {

    let algorithmSessionService: AppAlgorithmSessionService;
    let ipcService: MockIpcService;
    let algorithmSessions: AlgorithmSessionViewModel[];
    let zone: MockZone;
    let createAlgorithmSession: AlgorithmSessionViewModel;

    const getAllEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.GetAllAlgorithmSessionsListeners, algorithmSessions);
    };

    const createEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.CreateAlgorithmSessionListeners,
            createAlgorithmSession);
    };

    beforeAll(() => {
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        algorithmSessions = [
            new AlgorithmSessionViewModel({
                dataGroupId: 1, optionList: new OptionList()
            }),
            new AlgorithmSessionViewModel({
                dataGroupId: 2, optionList: new OptionList()
            }),
            new AlgorithmSessionViewModel({
                dataGroupId: 3, optionList: new OptionList()
            }),
            new AlgorithmSessionViewModel({
                dataGroupId: 4, optionList: new OptionList()
            }),
        ];
        ipcService.on(ExperimentsEvents.GetAllAlgorithmSessionsEvent, getAllEvent);
        ipcService.on(ExperimentsEvents.CreateAlgorithmSessionEvent, createEvent);
        algorithmSessionService = new AppAlgorithmSessionService(ipcService, zone);
    });

    afterEach(() => {
        ipcService.removeListenersFromAllChannels();
        algorithmSessionService.ngOnDestroy();
    });

    it('get should throw for not found', () => {
        expect(() => {
            algorithmSessionService.get(404);
        }).toThrowError();
    });

    it('get should return first session', () => {
        const session = algorithmSessionService.get(1);
        expect(session.dataGroupId).toBe(1);
    });

    it('has session should return false for not found', () => {
        expect(algorithmSessionService.hasSession(404)).toBeFalsy();
    });

    it('has session should return true for first session', () => {
        expect(algorithmSessionService
            .hasSession(
                algorithmSessions[0].dataGroupId)).toBeTruthy();
    });

    it('create session should updated new session', (done) => {
        createAlgorithmSession = new AlgorithmSessionViewModel({
            dataGroupId: 3, optionList: new OptionList()
        });
        algorithmSessionService.newSession.subscribe((value) => {
            expect(value.dataGroupId).toBe(3);
            done();
        });
        algorithmSessionService.create(3,
            new AlgorithmPluginViewModel({
                plugin: new Plugin({ name: 'name', className: 'classname', description: 'descrption',
                                     type: 'fetch'})
            }), {});
    });

    it('delete should call delete fetch session event', (done) => {
        ipcService.on(ExperimentsEvents.DeleteAlgorithmSessionEvent, (event, dataGroupId) => {
            expect(dataGroupId).toBe(1);
            done();
        });
        algorithmSessionService.delete(1);
    });

    it('delete listeners should call delete subject', (done) => {
        algorithmSessionService.sessionDeleted.subscribe((dataGroupId) => {
            expect(dataGroupId).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.DeleteAlgorithmSessionListeners, 1);
    });

    it('finish listeners should call session finish subject', (done) => {
        algorithmSessionService.sessionFinished.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.FinishedAlgorithmSessionListeners, 1);
    });

    it('update listeners should update subject', (done) => {
        algorithmSessionService.sessionUpdated.subscribe((value) => {
            expect(value.dataGroupId).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.UpdatedAlgorithmSessionListeners, new AlgorithmSessionViewModel({
            dataGroupId: 1, optionList: new OptionList()
        }));
    });

    it('submit should send options', (done) => {
        ipcService.on(ExperimentsEvents.SubmitOptionsAlgorithmSessionEvent, (event, dataGroupId, inputs) => {
            expect(dataGroupId).toBe(1);
            done();
        });
        algorithmSessionService.submitOptions(1, {});
    });

    it('execute command should send command', (done) => {
        ipcService.on(ExperimentsEvents.ExecuteCommandAlgorithmSessionEvent, (event, dataGroupId, command) => {
            expect(command).toEqual('cmd');
            done();
        });
        algorithmSessionService.executeCommand(1, 'cmd');
    });


});

