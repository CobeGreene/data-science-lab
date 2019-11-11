import { AppFetchSessionService } from './app-fetch.session-service';
import { MockPluginContext } from '../../contexts';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';

describe('Electron App Experiment Fetch Session Service Tests', () => {

    let mockPluginContext: MockPluginContext;
    let serviceContainer: MockServiceContainer;
    let fetchSessionService: AppFetchSessionService;

    beforeEach(() => {
        mockPluginContext = new MockPluginContext();
        serviceContainer = new MockServiceContainer();
        fetchSessionService = new AppFetchSessionService(serviceContainer);
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            return mockPluginContext;
        };
    });

    it('read should throw error for not found', () => {
        expect(() => {
            fetchSessionService.read(404);
        }).toThrowError();
    });

    it('all should return emplty list', () => {
        expect(fetchSessionService.all().length).toBe(0);
    });

    it('create a fetch session with a fetch plugin', (done) => {
        mockPluginContext.activate = <T>(_package, _plugin) => {
            return new Promise<T>((resolve, reject) => {
                const obj = new Object();
                resolve(obj as T);
            }); 
        };
        const plugin = new Plugin({ className: 'class', name: 'name', type: 'type', description: 'description' });
        const pluginPackage = new PluginPackage({ name: 'name', repositoryName: 'repo', username: 'username', owner: 'owner' });
        fetchSessionService.create(1, pluginPackage, plugin)
            .then((value) => {
                expect(value.fetchPlugin).toBeDefined();
                done();
            }).catch((reason) => {
                done.fail(reason);
            });
    });

    it('delete should throw for session it cannot find', () => {
        expect(() => {
            fetchSessionService.delete(404);
        }).toThrowError();
    });

});
