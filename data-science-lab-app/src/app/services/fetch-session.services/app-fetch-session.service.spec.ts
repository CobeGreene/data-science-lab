import { MockZone } from '../mock-zone';
import { AppFetchSessionService } from './app-fetch-session.service';
import { FetchSessionViewModel } from '../../../../shared/view-models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';
import { OptionList } from 'data-science-lab-core';
import { Plugin } from '../../../../shared/models';

describe('Angular App Fetch Session Service Tests', () => {

    let fetchSessionService: AppFetchSessionService;
    let ipcService: MockIpcService;
    let fetchSessions: FetchSessionViewModel[];
    let zone: MockZone;

    const getAllEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.GetAllFetchSessionsListeners, fetchSessions);
    };

    const createEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.CreateFetchSessionListeners, new FetchSessionViewModel({
            experimentId: 3, optionList: new OptionList()
        }));
    };

    beforeAll(() => {
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        fetchSessions = [
            new FetchSessionViewModel({ experimentId: 1, optionList: new OptionList() }),
            new FetchSessionViewModel({ experimentId: 2, optionList: new OptionList() })
        ];
        ipcService.on(ExperimentsEvents.GetAllFetchSessionsEvent, getAllEvent);
        ipcService.on(ExperimentsEvents.CreateFetchSessionEvent, createEvent);
        fetchSessionService = new AppFetchSessionService(ipcService, zone);
    });

    afterEach(() => {
        ipcService.removeListenersFromAllChannels();
        fetchSessionService.ngOnDestroy();
    });


    it('get should throw for not found', () => {
        expect(() => {
            fetchSessionService.get(404);
        }).toThrowError();
    });

    it('get should return first session', () => {
        const session = fetchSessionService.get(1);
        expect(session.experimentId).toBe(1);
    });

    it('has session should return false for not found', () => {
        expect(fetchSessionService.hasSession(404)).toBeFalsy();
    });

    it('has session should return true for first session', () => {
        expect(fetchSessionService.hasSession(fetchSessions[0].experimentId)).toBeTruthy();
    });

    it('create session should updated new session', (done) => {
        fetchSessionService.newSession.subscribe(() => {
            expect().nothing();
            done();
        });
        fetchSessionService.create(3, new Plugin({
            name: 'name', className: 'classname', description: 'descrption',
            type: 'fetch',
        }));
    });

    it('delete should call delete fetch session event', (done) => {
        ipcService.on(ExperimentsEvents.DeleteFetchSessionEvent, (event, id, _) => {
            expect(id).toBe(1);
            done();
        });
        fetchSessionService.delete(1);
    });

    it('delete listeners should call delete subject', (done) => {
        fetchSessionService.sessionDeleted.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.DeleteFetchSessionListeners, 1);
    });

    it('finish listeners should call session finish subject', (done) => {
        fetchSessionService.sessionFinished.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.FinishedFetchSessionListeners, 1);
    });

    it('update listeners should update subject', (done) => {
        fetchSessionService.sessionUpdated.subscribe((value) => {
            expect(value.experimentId).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.UpdatedFetchSessionListeners, new FetchSessionViewModel({
            experimentId: 1, optionList: new OptionList()
        }));
    });

    it('submit should send options', (done) => {
        ipcService.on(ExperimentsEvents.SubmitOptionsFetchSessionEvent, (event, id, inputs) => {
            expect(id).toBe(1);
            done();
        });
        fetchSessionService.submitOptions(1, {});
    });

    it('execute command should send command', (done) => {
        ipcService.on(ExperimentsEvents.ExecuteCommandFetchSessionEvent, (event, id, command) => {
            expect(command).toEqual('cmd');
            done();
        });
        fetchSessionService.executeCommand(1, 'cmd');
    });

});

