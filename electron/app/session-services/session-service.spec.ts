import { SessionService } from './session-service';
import { Session, SessionPlugin, Plugin, SessionOptions, SessionState } from '../../../shared/models';
import { ServiceContainer, SERVICE_TYPES } from '../service-container';
import { SessionDataService } from '../data-services/session-data-service';
import { Producer } from '../pipeline';
import { PluginContext } from '../contexts/plugin-context';
import { PluginOptions, PluginDataInput, TextOption } from 'data-science-lab-core';
import { PackageDataService } from '../data-services/package-data-service';
import { ErrorEvent } from '../../../shared/events';

let pluginActivate: () => Promise<void>;
let sessionFinish: (session: Session, plugin: any) => Promise<void>;
let sessionInput: (Session: Session, plugin: any) =>Promise<void>;

class MockSessionService extends SessionService {
    get eventCreate(): string {
        return 'Create';
    }
    get eventUpdate(): string {
        return 'Update';
    }
    get eventDelete(): string {
        return 'Delete';
    }
    get eventFinish(): string {
        return 'Finish';
    }
    get eventSelect(): string {
        return 'Select';
    }
    get eventOptions(): string {
        return 'Options';
    }
    get eventCommand(): string {
        return 'Command';
    }
    get eventInputs(): string {
        return 'Input';
    }
    get eventPrevious(): string {
        return 'Previous';
    }

    async pluginActivate() {
        await pluginActivate();
    }

    async sessionInputs(session: Session, plugin: any) {
        await sessionInput(session, plugin);
    }

    async sessionFinish(session: Session, plugin: any) {
        await sessionFinish(session, plugin);
    }
}

describe('Electron Session Service', () => {
    let serviceModel: MockSessionService;
    let serviceContainer: ServiceContainer;
    let dataService: SessionDataService;
    let packageService: PackageDataService;
    let producer: Producer;
    let context: PluginContext;
    let userPlugin: { getOptions: () => PluginOptions };
    let getOptions: PluginOptions;
    let sessionOptions: SessionOptions;
    let sessionPlugin: SessionPlugin;
    let plugin: Plugin;

    beforeAll(() => {
        sessionOptions = {
            currentRoute: '',
            newTab: false
        };
        plugin = {
            className: 'Class',
            description: 'Desc',
            name: 'Name',
            type: 'Type'
        };
        sessionPlugin = {
            className: 'Class',
            description: 'Desc',
            name: 'Name',
            type: 'Type',
            inputs: [
                {
                    id: 'id', label: 'label', type: 'string', min: 0
                }
            ]
        };
    });

    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SessionDataService) {
                return dataService;
            } else if (type === SERVICE_TYPES.PluginContext) {
                return context;
            } else if (type === SERVICE_TYPES.PackageDataService) {
                return packageService;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });
        packageService = jasmine.createSpyObj('PackageDataService', ['find']);
        producer = jasmine.createSpyObj('Producer', ['send']);
        dataService = jasmine.createSpyObj('SessionDataService', ['post', 'delete', 'get', 'reference', 'update']);
        context = jasmine.createSpyObj('PluginContext', ['activate', 'deactivate']);

        userPlugin = jasmine.createSpyObj('any', ['getOptions']);
        getOptions = jasmine.createSpyObj('PluginOptions', ['noMore', 'options', 'executeCommand', 'submit']);
        (userPlugin.getOptions as jasmine.Spy).and.callFake(() => {
            return getOptions;
        });

        pluginActivate = jasmine.createSpy('pluginActivate', async () => {

        });

        sessionFinish = jasmine.createSpy('sessionFinish', async () => {

        });

        sessionInput = jasmine.createSpy('sessionInput', async () => {

        });


        serviceModel = new MockSessionService(serviceContainer, producer);
    });

    it('create should post a new session', (done) => {
        (dataService.post as jasmine.Spy).and.returnValue({
            id: 1
        });

        (producer.send as jasmine.Spy).and.callFake((event, session) => {
            expect(event).toBe('Create');
            expect(session.id).toBe(1);
            done();
        });
        serviceModel.create(1, sessionOptions);
    });

    it('delete should post deleted session', async (done) => {
        (dataService.get as jasmine.Spy).and.returnValue({
            id: 1
        });
        (producer.send as jasmine.Spy).and.callFake((event, session) => {
            expect(event).toBe('Delete');
            expect(session).toBe(1);
            done();
        });
        await serviceModel.delete(1);
    });

    it('delete should only call delete once, but no deactivation', async () => {
        (dataService.get as jasmine.Spy).and.returnValue({
            id: 1
        });
        await serviceModel.delete(1);
        expect(dataService.delete).toHaveBeenCalledTimes(1);
        expect(context.deactivate).toHaveBeenCalledTimes(0);
    });

    it('delete with plugin should deactivate using plugin context', async () => {
        (dataService.get as jasmine.Spy).and.returnValue({
            id: 1,
            plugin: sessionPlugin
        });
        await serviceModel.delete(1);

        expect(dataService.delete).toHaveBeenCalledTimes(1);
        expect(context.deactivate).toHaveBeenCalledTimes(1);
    });

    it('select should publish error if activation fail', async (done) => {
        (producer.send as jasmine.Spy).and.callFake((event, _error) => {
            expect(event).toBe(ErrorEvent);
            done();
        });
        (context.activate as jasmine.Spy).and.callFake((value) => {
            return new Promise((_, reject) => reject());
        });
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        await serviceModel.select(1, plugin);
    });

    it('select plugin should update session to setup in data service', async (done) => {
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return false;
        });
        (getOptions.options as jasmine.Spy).and.callFake(() => [
            new TextOption({ id: 'abc', label: 'abc' })
        ]);
        (context.activate as jasmine.Spy).and.callFake((value) => {
            return new Promise((resolve, _) => resolve(userPlugin));
        });
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (dataService.update as jasmine.Spy).and.callFake((session) => {
            expect(session.id).toBe(1);
            expect(session.optionList.length).toBe(1);
            expect(session.state).toBe(SessionState.Setup);
            expect(session.isWaiting).toBe(false);
            done();
        });

        await serviceModel.select(1, plugin);
    });

    it('select plugin should update session to input in data service', async (done) => {
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return false;
        });
        (getOptions.options as jasmine.Spy).and.callFake(() => [
            new TextOption({ id: 'abc', label: 'abc' })
        ]);
        (context.activate as jasmine.Spy).and.callFake((value) => {
            return new Promise((resolve, _) => resolve(userPlugin));
        });
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (dataService.update as jasmine.Spy).and.callFake((session) => {
            expect(session.id).toBe(1);
            expect(session.state).toBe(SessionState.Input);
            expect(session.isWaiting).toBe(false);
            done();
        });

        await serviceModel.select(1, sessionPlugin);
    });

    it('select plugin should call plugin activation and reference', async () => {
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return false;
        });
        (getOptions.options as jasmine.Spy).and.callFake(() => [
            new TextOption({ id: 'abc', label: 'abc' })
        ]);
        (context.activate as jasmine.Spy).and.callFake((value) => {
            return new Promise((resolve, _) => resolve(userPlugin));
        });
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });

        await serviceModel.select(1, sessionPlugin);

        expect(pluginActivate).toHaveBeenCalledTimes(1);
        expect(dataService.reference).toHaveBeenCalledTimes(1);
    });

    it('select plugin should call session finish, delete, and deactivate when session is finish', async () => {
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return true;
        });
        (context.activate as jasmine.Spy).and.callFake((value) => {
            return new Promise((resolve, _) => resolve(userPlugin));
        });
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });

        await serviceModel.select(1, plugin);

        expect(sessionFinish).toHaveBeenCalledTimes(1);
        expect(context.deactivate).toHaveBeenCalledTimes(1);
        expect(dataService.delete).toHaveBeenCalledTimes(1);
    });

    it('command should throw error if execute command rejects', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return false;
        });
        (dataService.reference as jasmine.Spy).and.callFake(() => {
            return userPlugin;
        });
        (getOptions.executeCommand as jasmine.Spy).and.callFake(() => {
            return new Promise((_, reject) => reject());
        });
        (producer.send as jasmine.Spy).and.callFake((event, _error) => {
            expect(event).toBe(ErrorEvent);
            done();
        });

        await serviceModel.command(1, 'command');
    });

    it('command should update session when execute command', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return false;
        });
        (dataService.reference as jasmine.Spy).and.callFake(() => {
            return userPlugin;
        });
        (getOptions.executeCommand as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve, _) => resolve());
        });

        (dataService.update as jasmine.Spy).and.callFake((session) => {
            expect(session.id).toBe(1);
            expect(session.state).toBe(SessionState.Setup);
            expect(session.isWaiting).toBe(false);
            done();
        });

        await serviceModel.command(1, 'command');
    });
    
    it('command should update session on producer', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return false;
        });
        (dataService.reference as jasmine.Spy).and.callFake(() => {
            return userPlugin;
        });
        (getOptions.executeCommand as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve, _) => resolve());
        });
        (producer.send as jasmine.Spy).and.callFake((event, session) => {
            expect(event).toBe('Update');
            expect(session.id).toBe(1);
            done();
        });

        await serviceModel.command(1, 'command');
    });

    it('command should finish session and call session finish', async () => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return true;
        });
        (dataService.reference as jasmine.Spy).and.callFake(() => {
            return userPlugin;
        });
        (getOptions.executeCommand as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve, _) => resolve());
        });

        await serviceModel.command(1, 'command');

        expect(sessionFinish).toHaveBeenCalledTimes(1);
        expect(context.deactivate).toHaveBeenCalledTimes(1);
        expect(dataService.delete).toHaveBeenCalledTimes(1);
    });

    it('options should throw error if options submit rejects', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return false;
        });
        (dataService.reference as jasmine.Spy).and.callFake(() => {
            return userPlugin;
        });
        (getOptions.submit as jasmine.Spy).and.callFake(() => {
            throw new Error(`Error`);
        });
        (producer.send as jasmine.Spy).and.callFake((event, _error) => {
            expect(event).toBe(ErrorEvent);
            done();
        });

        await serviceModel.options(1, {});
    });

    it('options should update session when options', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return false;
        });
        (dataService.reference as jasmine.Spy).and.callFake(() => {
            return userPlugin;
        });
        (dataService.update as jasmine.Spy).and.callFake((session) => {
            expect(session.id).toBe(1);
            expect(session.state).toBe(SessionState.Setup);
            expect(session.isWaiting).toBe(false);
            done();
        });

        await serviceModel.options(1, {});
    });

    it('options should update session on producer', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return false;
        });
        (dataService.reference as jasmine.Spy).and.callFake(() => {
            return userPlugin;
        });
        (producer.send as jasmine.Spy).and.callFake((event, session) => {
            expect(event).toBe('Update');
            expect(session.id).toBe(1);
            done();
        });

        await serviceModel.options(1, {});
    });

    it('options should finish session and call session finish', async () => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return true;
        });
        (dataService.reference as jasmine.Spy).and.callFake(() => {
            return userPlugin;
        });
        (getOptions.executeCommand as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve, _) => resolve());
        });

        await serviceModel.options(1, {});

        expect(sessionFinish).toHaveBeenCalledTimes(1);
        expect(context.deactivate).toHaveBeenCalledTimes(1);
        expect(dataService.delete).toHaveBeenCalledTimes(1);
    });

    it('input should move session to setup', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return false;
        });
        (dataService.reference as jasmine.Spy).and.callFake(() => {
            return userPlugin;
        });
        (dataService.update as jasmine.Spy).and.callFake((session) => {
            expect(session.id).toBe(1);
            expect(session.state).toBe(SessionState.Setup);
            expect(session.inputDict).toEqual({});
            expect(session.isWaiting).toBe(false);
            expect(sessionInput).toHaveBeenCalledTimes(1);
            done();
        });

        await serviceModel.inputs(1, {});
    });
    
    it('input should call session update', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return false;
        });
        (dataService.reference as jasmine.Spy).and.callFake(() => {
            return userPlugin;
        });
        (producer.send as jasmine.Spy).and.callFake((event, session) => {
            expect(event).toBe('Update');
            expect(session.id).toBe(1);
            expect(sessionInput).toHaveBeenCalledTimes(1);
            done();
        });

        await serviceModel.inputs(1, {});
    });

    it('input should finish session for no options', async () => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1
            };
        });
        (getOptions.noMore as jasmine.Spy).and.callFake(() => {
            return true;
        });
        (dataService.reference as jasmine.Spy).and.callFake(() => {
            return userPlugin;
        });
        (getOptions.executeCommand as jasmine.Spy).and.callFake(() => {
            return new Promise((resolve, _) => resolve());
        });

        await serviceModel.inputs(1, {});

        expect(sessionFinish).toHaveBeenCalledTimes(1);
        expect(context.deactivate).toHaveBeenCalledTimes(1);
        expect(dataService.delete).toHaveBeenCalledTimes(1);
        expect(sessionInput).toHaveBeenCalledTimes(1);
    });

    it('previous should call data service delete', async () => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1, 
                state: SessionState.Select
            };
        });

        await serviceModel.previous(1);

        expect(dataService.delete).toHaveBeenCalledTimes(1);
    });

    it('previous should produce finish when in select state', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1, 
                state: SessionState.Select,
                returnPath: 'return'
            };
        });
        (producer.send as jasmine.Spy).and.callFake((event, session, returnPath) => {
            expect(event).toBe('Finish');
            expect(session).toBe(1);
            expect(returnPath).toBe('return');
            done();
        });

        await serviceModel.previous(1);
    });

    it('previous should produce call data service update to input', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1, 
                state: SessionState.Input,
                returnPath: 'return'
            };
        });
        (dataService.update as jasmine.Spy).and.callFake((session) => {
            expect(session.id).toBe(1);
            expect(session.state).toBe(SessionState.Select);
            expect(session.isWaiting).toBe(false);
            done();
        });

        await serviceModel.previous(1);
    });
    
    it('previous should produce call context to deactivate', async () => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1, 
                state: SessionState.Input,
                returnPath: 'return'
            };
        });

        await serviceModel.previous(1);
        expect(context.deactivate).toHaveBeenCalledTimes(1);
    });

    it('previous should produce session update', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1, 
                state: SessionState.Input,
            };
        });
        (producer.send as jasmine.Spy).and.callFake((event, session) => {
            expect(event).toBe('Update');
            expect(session.id).toBe(1);
            done();
        });

        await serviceModel.previous(1);
    });


    it('previous should update to input on data service', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1, 
                state: SessionState.Setup,
                plugin: sessionPlugin
            };
        });
        (dataService.update as jasmine.Spy).and.callFake((session) => {
            expect(session.id).toBe(1);
            expect(session.state).toBe(SessionState.Input);
            expect(session.isWaiting).toBe(false);
            expect(session.optionList).toBe(undefined);
            done();
        });

        await serviceModel.previous(1);
    });
    
    it('previous should deactivate and reactive when going back to previous', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1, 
                state: SessionState.Setup,
                plugin: sessionPlugin,
            };
        });
        (dataService.update as jasmine.Spy).and.callFake((session) => {
            expect(session.id).toBe(1);
            expect(session.state).toBe(SessionState.Input);
            expect(session.isWaiting).toBe(false);
            expect(session.optionList).toBe(undefined);
            expect(pluginActivate).toHaveBeenCalledTimes(1);
            expect(dataService.reference).toHaveBeenCalledTimes(1);
            expect(context.activate).toHaveBeenCalledTimes(1);
            done();
        });

        await serviceModel.previous(1);
    });
    
    it('previous should update to select on data service', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1, 
                state: SessionState.Setup,
                plugin
            };
        });
        (dataService.update as jasmine.Spy).and.callFake((session) => {
            expect(session.id).toBe(1);
            expect(session.state).toBe(SessionState.Select);
            expect(session.isWaiting).toBe(false);
            expect(session.optionList).toBe(undefined);
            done();
        });

        await serviceModel.previous(1);
    });

    it('previous should call decactive for plugin', async () => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1, 
                state: SessionState.Setup,
                plugin
            };
        });

        await serviceModel.previous(1);
        expect(context.deactivate).toHaveBeenCalledTimes(1);
    });
    
    it('previous should update to input on producer', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1, 
                state: SessionState.Setup,
                plugin: sessionPlugin
            };
        });
        (producer.send as jasmine.Spy).and.callFake((event, session) => {
            expect(event).toBe('Update');
            expect(session.id).toBe(1);
            done();
        });

        await serviceModel.previous(1);
    });
    
    it('previous should update to select on producer', async (done) => {
        (dataService.get as jasmine.Spy).and.callFake(() => {
            return {
                id: 1, 
                state: SessionState.Setup,
                plugin
            };
        });
        (producer.send as jasmine.Spy).and.callFake((event, session) => {
            expect(event).toBe('Update');
            expect(session.id).toBe(1);
            done();
        });

        await serviceModel.previous(1);
    });


});
