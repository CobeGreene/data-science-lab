import { FetchPluginSessionService } from './fetch-plugin.session-service';
import { FetchSession } from '../../models/fetch-session';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { PluginContext } from '../../contexts';
import { FetchPlugin } from 'data-science-lab-core';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';

export class AppFetchPluginSessionService implements FetchPluginSessionService {

    private fetchSessions: FetchSession[];
    
    constructor(private serviceContainer: ServiceContainer) {
        this.fetchSessions = [];
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

    create(experimentId: number): FetchSession {
        const findIndex = this.fetchSessions.findIndex((value) => {
            return value.experimentId === experimentId;
        });
        if (findIndex >= 0) {
            throw new Error(`Experiment with id ${experimentId} already has a fetch session.`);        
        }
        const session = new FetchSession({
            experimentId
        });
        this.fetchSessions.push(session);
        return session;
    }
    
    select(experimentId: number, pluginPackage: PluginPackage, plugin: Plugin): Promise<FetchSession> {
        return new Promise<FetchSession>(async (resolve, reject) => {
            const findIndex = this.fetchSessions.findIndex((value) => {
                return value.experimentId === experimentId;
            });
            if (findIndex < 0) {
                reject(new Error(`Couldn't find fetch session with experiment id ${experimentId}`));
            } else if (this.fetchSessions[findIndex].selected) {
                reject(new Error(`Fetch session with experiment id ${experimentId} is already selected.`));
            }
            try {
                const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
                const fetchPlugin = await pluginContext.activate<FetchPlugin>(pluginPackage, plugin); 
                this.fetchSessions[findIndex].select(pluginPackage, plugin, fetchPlugin);
                resolve(this.fetchSessions[findIndex]);
            } catch (error) {
                reject(error);
            }
        });
    }

    deselect(experimentId: number): FetchSession {
        const findIndex = this.fetchSessions.findIndex((value) => {
            return value.experimentId === experimentId;
        });
        if (findIndex < 0) {
            throw new Error(`Couldn't find fetch session with experiment id ${experimentId}`);
        } else if (!this.fetchSessions[findIndex].selected) {
            throw new Error(`Fetch session with experiment id ${experimentId} is not selected.`);
        }
        const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
        pluginContext.deactivate(this.fetchSessions[findIndex].pluginPackage, this.fetchSessions[findIndex].plugin);
        this.fetchSessions[findIndex].deselect();
        return this.fetchSessions[findIndex];
    }
    
    delete(experimentId: number) {
        const findIndex = this.fetchSessions.findIndex((value) => {
            return value.experimentId === experimentId;
        });
        if (findIndex < 0) {
            throw new Error(`Couldn't find fetch session with experiment id ${experimentId}`);
        }
        if (this.fetchSessions[findIndex].selected) {
            const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
            pluginContext.deactivate(this.fetchSessions[findIndex].pluginPackage, this.fetchSessions[findIndex].plugin);
        }
        this.fetchSessions.splice(findIndex, 1);
    }
}
