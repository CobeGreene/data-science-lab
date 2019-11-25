import { AppAlgorithmSessionService } from './app-algorithm.session-service';
import { MockPluginContext } from '../../contexts';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { MockServiceContainer, SERVICE_TYPES } from '../../services-container';

describe('Electron App Algorithm Session Service Tests', () => {

    class MockAlgorithmInput {
        submit(input: any) {

        }
    }
    class MockAlgorithm {
        getInputs() {
            return new MockAlgorithmInput();
        }
    }

    let pluginContext: MockPluginContext;
    let serviceContainer: MockServiceContainer;
    let sessionService: AppAlgorithmSessionService;

    beforeEach(() => {
        pluginContext = new MockPluginContext();
        serviceContainer = new MockServiceContainer();
        serviceContainer.getType = (type: SERVICE_TYPES) => {
            switch (type) {
                case SERVICE_TYPES.PluginContext:
                    return pluginContext;
                    default:
                    throw new Error(`Couldn't resolve type.`);
            }
        };
        sessionService = new AppAlgorithmSessionService(serviceContainer);
    });

    it('read should throw error for not found', () => {
        expect(() => {
            sessionService.read(404);
        }).toThrowError();
    });

    it('all should return emplty list', () => {
        expect(sessionService.all().length).toBe(0);
    });

    it('create a algorithm session with a transform plugin', (done) => {
        pluginContext.activate = <T>(_package, _plugin) => {
            return new Promise<T>((resolve, reject) => {
                const obj = new MockAlgorithm() as unknown;
                resolve(obj as T);
            }); 
        };
        const plugin = new Plugin({ className: 'class', name: 'name', type: 'type', description: 'description' });
        const pluginPackage = new PluginPackage({ name: 'name', repositoryName: 'repo', username: 'username', owner: 'owner' });
        sessionService.create(1, pluginPackage, plugin, {}, {})
            .then((value) => {
                expect(value.algorithmPlugin).toBeDefined();
                done();
            }).catch((reason) => {
                done.fail(reason);
            });
    });

    it('delete should throw for session it cannot find', () => {
        expect(() => {
            sessionService.delete(404);
        }).toThrowError();
    });

    it('remove from list so throw for not found', () => {
        expect(() => {
            sessionService.removeFromService(404);
        }).toThrowError();
    });

    
    it('remove from list so decriement list', (done) => {
        pluginContext.activate = <T>(_package, _plugin) => {
            return new Promise<T>((resolve, reject) => {
                const obj = new MockAlgorithm() as unknown;
                resolve(obj as T);
            }); 
        };
        const plugin = new Plugin({ className: 'class', name: 'name', type: 'type', description: 'description' });
        const pluginPackage = new PluginPackage({ name: 'name', repositoryName: 'repo', username: 'username', owner: 'owner' });
        sessionService.create(1, pluginPackage, plugin, {}, {})
            .then((value) => {
                sessionService.removeFromService(1);
                expect(sessionService.all().length).toBe(0);
                done();
            }).catch((reason) => {
                done.fail(reason);
            });
    });


});

