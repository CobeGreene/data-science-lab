import { AlgorithmSession } from '../../models';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { PluginData, AlgorithmPlugin } from 'data-science-lab-core';
import { AlgorithmSessionService } from './algorithm.session-service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { PluginContext } from '../../contexts';

export class AppAlgorithmSessionService implements AlgorithmSessionService {
    
    private algorithmSessions: AlgorithmSession[];

    constructor(private serviceContainer: ServiceContainer) {
        this.algorithmSessions = [];
    }
    

    all(): AlgorithmSession[] {
        return this.algorithmSessions;
    }    
    
    read(dataGroupId: number): AlgorithmSession {
        const find = this.algorithmSessions.find((value) => {
            return value.dataGroupId === dataGroupId;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find algorithm session with data group id ${dataGroupId}`);
    }
    
    delete(dataGroupId: number): void {
        const findIndex = this.algorithmSessions.findIndex((value) => {
            return value.dataGroupId === dataGroupId;
        });

        if (findIndex < 0) {
            throw new Error(`Couldn't find algorithm session with data group id ${dataGroupId}`);
        }

        const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
        pluginContext.deactivate(this.algorithmSessions[findIndex].pluginPackage,
            this.algorithmSessions[findIndex].plugin)
            .then(() => {})
            .catch(() => {});
        this.algorithmSessions.splice(findIndex, 1);
    }   
    
    create(dataGroupId: number, pluginPackage: PluginPackage,
           plugin: Plugin, 
           inputs: { [id: string]: PluginData; }, 
           features: { [id: string]: { label: string; type: string; }[]; }): Promise<AlgorithmSession> {
        return new Promise<AlgorithmSession>(async (resolve, reject) => {
            const findIndex = this.algorithmSessions.findIndex((value) => {
                return value.dataGroupId === dataGroupId;
            });
            if (findIndex >= 0) {
                reject(new Error(`Experiment with id ${dataGroupId} already has a algorithm session.`));
            }
            try {
                const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
                const algorithmPlugin = await pluginContext.activate<AlgorithmPlugin>(pluginPackage, plugin);

                const inputObj = algorithmPlugin.getInputs();
                inputObj.submit(inputs);

                const session = new AlgorithmSession({
                    dataGroupId,
                    plugin,
                    pluginPackage,
                    algorithmPlugin,
                    dataGroupFeatures: features
                });
                this.algorithmSessions.push(session);
                resolve(session);                

            } catch (error) {
                reject(error);
            }
        });
    }
    removeFromService(dataGroupId: number): void {
        const findIndex = this.algorithmSessions.findIndex((value) => {
            return value.dataGroupId === dataGroupId;
        });
        if (findIndex < 0) {
            throw new Error(`Experiment with id ${dataGroupId} doesn't exits in service.`);
        }
        this.algorithmSessions.splice(findIndex, 1);
    }




}


