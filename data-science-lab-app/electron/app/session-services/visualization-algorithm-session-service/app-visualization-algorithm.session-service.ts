import { VisualizationSession } from '../../models';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { PluginData, VisualizationPlugin } from 'data-science-lab-core';
import { VisualizationAlgorithmSessionService } from './visualization-algorithm.session-service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { PluginContext } from '../../contexts';

export class AppVisualizationAlgorithmSessionService implements VisualizationAlgorithmSessionService {

    private visualizationSessions: VisualizationSession[];

    constructor(private serviceContainer: ServiceContainer) {
        this.visualizationSessions = [];
    }

    all(): VisualizationSession[] {
        return this.visualizationSessions;
    }

    read(id: number): VisualizationSession {
        const find = this.visualizationSessions.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find visualization session with algorithm id ${id}`);
    }
    
    delete(id: number): void {
        const findIndex = this.visualizationSessions.findIndex((value) => {
            return value.id === id;
        });

        if (findIndex < 0) {
            throw new Error(`Couldn't find visualization session with algorithm id ${id}`);
        }

        const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
        
        pluginContext.deactivate(this.visualizationSessions[findIndex].pluginPackage,
            this.visualizationSessions[findIndex].plugin)
            .then(() => { })
            .catch(() => { });

        this.visualizationSessions.splice(findIndex, 1);
    }

    create(id: number, pluginPackage: PluginPackage,
           plugin: Plugin,
           inputs: { [id: string]: PluginData; },
           editing: number[]): Promise<VisualizationSession> {
        return new Promise<VisualizationSession>(async (resolve, reject) => {
            const findIndex = this.visualizationSessions.findIndex((value) => {
                return value.id === id;
            });
            if (findIndex >= 0) {
                reject(new Error(`Algorithm with id ${id} already has a visualization session.`));
            }
            try {
                const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
                const visualizationPlugin = await pluginContext.activate<VisualizationPlugin>(pluginPackage, plugin);

                const inputObj = visualizationPlugin.getInputs();
                inputObj.submit(inputs);

                const session = new VisualizationSession({
                    id,
                    plugin,
                    pluginPackage,
                    visualizationPlugin,
                    editing
                });
                
                this.visualizationSessions.push(session);
                resolve(session);
            } catch (error) {
                reject(error);
            }
        });
    }
}
