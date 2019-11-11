import { FetchSessionService } from './fetch.session-service';
import { FetchSession } from '../../models/fetch-session';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { PluginContext } from '../../contexts';
import { FetchPlugin, FileService } from 'data-science-lab-core';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';

export class AppFetchSessionService implements FetchSessionService {

    private fetchSessions: FetchSession[];
    
    constructor(private serviceContainer: ServiceContainer) {
        this.fetchSessions = [];
    }

    all(): FetchSession[] {
        return this.fetchSessions;
    }
    
    read(experimentId: number): FetchSession {
        const find = this.fetchSessions.find((value) => {
            return value.experimentId === experimentId;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find fetch session with experiment id ${experimentId}.`);
    }   
    
    create(experimentId: number, pluginPackage: PluginPackage, plugin: Plugin): Promise<FetchSession> {
        return new Promise<FetchSession>(async (resolve, reject) => {
            const findIndex = this.fetchSessions.findIndex((value) => {
                return value.experimentId === experimentId;
            });
            if (findIndex >= 0) {
                reject(Error(`Experiment with id ${experimentId} already has a fetch session.`));        
            }
            try {
                const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
                const fetchPlugin = await pluginContext.activate<FetchPlugin>(pluginPackage, plugin); 
                fetchPlugin.setFileService(this.serviceContainer.resolve<FileService>(SERVICE_TYPES.FileService));
                const session = new FetchSession({
                    experimentId,
                    plugin,
                    pluginPackage,
                    fetchPlugin
                });
                this.fetchSessions.push(session);
                resolve(session);
            } catch (error) {
                reject(error);
            }
        });
    }

    delete(experimentId: number) {
        const findIndex = this.fetchSessions.findIndex((value) => {
            return value.experimentId === experimentId;
        });
        if (findIndex < 0) {
            throw new Error(`Couldn't find fetch session with experiment id ${experimentId}`);
        }
        const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
        pluginContext.deactivate(this.fetchSessions[findIndex].pluginPackage, this.fetchSessions[findIndex].plugin)
            .then(() => {})
            .catch(() => {});
        this.fetchSessions.splice(findIndex, 1);
    }
}
