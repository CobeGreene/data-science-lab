import { MockZone } from '../mock-zone';
import { AppTransformSessionService } from './app-transform-session.service';
import { FetchSessionViewModel, TransformSessionViewModel } from '../../../../shared/view-models';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';
import { OptionList } from 'data-science-lab-core';
import { Plugin, SelectTransformPlugin } from '../../../../shared/models';

describe('Angular App Transform Session Service Tests', () => {

    let transformSessionService: AppTransformSessionService;
    let ipcService: MockIpcService;
    let transformSessions: TransformSessionViewModel[];
    let zone: MockZone;
    let createTransformSession: TransformSessionViewModel;


    const getAllEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.GetAllTransformSessionsListeners, transformSessions);
    };

    const createEvent = (event, ...args): void => {
        ipcService.send(ExperimentsEvents.CreateTransformSessionListeners,
            createTransformSession);
    };

    beforeAll(() => {
        zone = new MockZone({});
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        transformSessions = [
            new TransformSessionViewModel({
                dataGroupId: 1, optionList: new OptionList()
            }),
            new TransformSessionViewModel({
                dataGroupId: 2, optionList: new OptionList()
            }),
            new TransformSessionViewModel({
                dataGroupId: 3, optionList: new OptionList()
            }),
            new TransformSessionViewModel({
                dataGroupId: 4, optionList: new OptionList()
            }),
        ];
        ipcService.on(ExperimentsEvents.GetAllTransformSessionsEvent, getAllEvent);
        ipcService.on(ExperimentsEvents.CreateTransformSessionEvent, createEvent);
        transformSessionService = new AppTransformSessionService(ipcService, zone);
    });

    afterEach(() => {
        ipcService.removeListenersFromAllChannels();
        transformSessionService.ngOnDestroy();
    });

    it('get should throw for not found', () => {
        expect(() => {
            transformSessionService.get(404);
        }).toThrowError();
    });

    it('get should return first session', () => {
        const session = transformSessionService.get(1);
        expect(session.dataGroupId).toBe(1);
    });

    it('has session should return false for not found', () => {
        expect(transformSessionService.hasSession(404)).toBeFalsy();
    });

    it('has session should return true for first session', () => {
        expect(transformSessionService
            .hasSession(
                transformSessions[0].dataGroupId)).toBeTruthy();
    });

    it('create session should updated new session', (done) => {
        createTransformSession = new TransformSessionViewModel({
            dataGroupId: 3, optionList: new OptionList()
        });
        transformSessionService.newSession.subscribe((value) => {
            expect(value.dataGroupId).toBe(3);
            done();
        });
        transformSessionService.create(3,
            new SelectTransformPlugin({
                plugin: new Plugin({
                    name: 'name', className: 'classname', description: 'descrption',
                    type: 'fetch',
                }),
            }), {}
        );
    });

    it('delete should call delete fetch session event', (done) => {
        ipcService.on(ExperimentsEvents.DeleteTransformSessionEvent, (event, dataGroupId) => {
            expect(dataGroupId).toBe(1);
            done();
        });
        transformSessionService.delete(1);
    });

    it('delete listeners should call delete subject', (done) => {
        transformSessionService.sessionDeleted.subscribe((dataGroupId) => {
            expect(dataGroupId).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.DeleteTransformSessionListeners, 1);
    });

    it('finish listeners should call session finish subject', (done) => {
        transformSessionService.sessionFinished.subscribe((value) => {
            expect(value).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.FinishedTransformSessionListeners, 1);
    });

    it('update listeners should update subject', (done) => {
        transformSessionService.sessionUpdated.subscribe((value) => {
            expect(value.dataGroupId).toBe(1);
            done();
        });
        ipcService.send(ExperimentsEvents.UpdatedTransformSessionListeners, new TransformSessionViewModel({
            dataGroupId: 1, optionList: new OptionList()
        }));
    });

    it('submit should send options', (done) => {
        ipcService.on(ExperimentsEvents.SubmitOptionsTransformSessionEvent, (event, dataGroupId, inputs) => {
            expect(dataGroupId).toBe(1);
            done();
        });
        transformSessionService.submitOptions(1, {});
    });

    it('execute command should send command', (done) => {
        ipcService.on(ExperimentsEvents.ExecuteCommandTransformSessionEvent, (event, dataGroupId, command) => {
            expect(command).toEqual('cmd');
            done();
        });
        transformSessionService.executeCommand(1, 'cmd');
    });


});

