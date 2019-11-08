import { AppFetchPluginSessionService } from './app-fetch-plugin.session-service';
import { MockPluginContext } from '../../contexts';
import { FetchSession } from '../../models';
import { FetchPlugin } from 'data-science-lab-core';
import { Plugin, PluginPackage } from '../../../../shared/models';

describe('Electron App Experiment Fetch Plguin Session Service Tests', () => {

    let mockPluginContext: MockPluginContext;
    let fetchPluginSessionService: AppFetchPluginSessionService;

    beforeEach(() => {
        mockPluginContext = new MockPluginContext();
        fetchPluginSessionService = new AppFetchPluginSessionService(mockPluginContext);
    });

    it('read should throw error for not found', () => {
        expect(() => {
            fetchPluginSessionService.read(404);
        }).toThrowError();
    });

    it('create should create a session that is not selected', () => {
        const session = fetchPluginSessionService.create(1);
        expect(session.experimentId).toBe(1);
        expect(session.selected).toBeFalsy();
    });

    it('read should return fetch session that was created', () => {
        fetchPluginSessionService.create(1);
        const session = fetchPluginSessionService.read(1);
        expect(session.selected).toBeFalsy();
    });

    it('create should throw for experiment that already has a session', () => {
        fetchPluginSessionService.create(1);
        expect(() => {
            fetchPluginSessionService.create(1);
        }).toThrowError();
    });

    it('select should create a fetch session with a fetch plugin', (done) => {
        mockPluginContext.activate = <T>(_package, _plugin) => {
            return new Promise<T>((resolve, reject) => {
                const obj = new Object();
                resolve(obj as T);
            });
        };
        fetchPluginSessionService.create(1);
        const plugin = new Plugin({ className: 'class', name: 'name', type: 'type', description: 'description' });
        const pluginPackage = new PluginPackage({ name: 'name', repositoryName: 'repo', username: 'username', owner: 'owner' });
        fetchPluginSessionService.select(1, pluginPackage, plugin)
            .then((value) => {
                expect(value.selected).toBeTruthy();
                done();
            }).catch((reason) => {
                done.fail(reason);
            });
    });

    it('select should throw for session not created', (done) => {
        const plugin = new Plugin({ className: 'class', name: 'name', type: 'type', description: 'description' });
        const pluginPackage = new PluginPackage({ name: 'name', repositoryName: 'repo', username: 'username', owner: 'owner' });
        fetchPluginSessionService.select(1, pluginPackage, plugin)
            .then((value) => {
                done.fail(`Didn't expect successful execution.`);
            }).catch((reason) => {
                expect().nothing();
                done();
            });
    });

    it('select should throw for session already selected', async (done) => {
        fetchPluginSessionService.create(1);
        const plugin = new Plugin({ className: 'class', name: 'name', type: 'type', description: 'description' });
        const pluginPackage = new PluginPackage({ name: 'name', repositoryName: 'repo', username: 'username', owner: 'owner' });
        await fetchPluginSessionService.select(1, pluginPackage, plugin);
        try {
            await fetchPluginSessionService.select(1, pluginPackage, plugin);
            done.fail(`Didn't expect successful execution.`);
        } catch (reason) {
            expect().nothing();
            done();
        }
    });

    it('deselected should throw for not found session', () => {
        expect(() => {
            fetchPluginSessionService.deselect(404);
        }).toThrowError();
    });

    it('deselecte should set session to not selected', async () => {
        fetchPluginSessionService.create(1);
        const plugin = new Plugin({ className: 'class', name: 'name', type: 'type', description: 'description' });
        const pluginPackage = new PluginPackage({ name: 'name', repositoryName: 'repo', username: 'username', owner: 'owner' });
        await fetchPluginSessionService.select(1, pluginPackage, plugin);
        fetchPluginSessionService.deselect(1);
        expect(fetchPluginSessionService.read(1).selected).toBeFalsy();
    });
    
    it('deselected should throw for session not selected', () => {
        fetchPluginSessionService.create(1);
        expect(() => {
            fetchPluginSessionService.deselect(1);
        }).toThrowError();
    });

    it('delete should remove session from its list', () => {
        fetchPluginSessionService.create(1);
        fetchPluginSessionService.delete(1);
        expect(() => {
            fetchPluginSessionService.read(1);
        }).toThrowError();
    });

    it('delete shoudl throw for session it cannot find', () => {
        expect(() => {
            fetchPluginSessionService.delete(404);
        }).toThrowError();
    });

});
