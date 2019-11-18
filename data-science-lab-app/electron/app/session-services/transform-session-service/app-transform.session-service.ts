import { TransformSession } from '../../models';
import { Plugin, PluginPackage } from '../../../../shared/models';
import { PluginData, TransformPlugin } from 'data-science-lab-core';
import { TransformSessionService } from './transform.session-service';
import { ServiceContainer, SERVICE_TYPES } from '../../services-container';
import { PluginContext } from '../../contexts';

export class AppTransformSessionService implements TransformSessionService {

    private transformSessions: TransformSession[];

    constructor(private serviceContainer: ServiceContainer) {
        this.transformSessions = [];
    }

    all(): TransformSession[] {
        return this.transformSessions;
    }

    read(dataGroupId: number): TransformSession {
        const find = this.transformSessions.find((value) => {
            return value.dataGroupId === dataGroupId;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find transform session with data group id ${dataGroupId}`);
    }
    delete(dataGroupId: number): void {
        const findIndex = this.transformSessions.findIndex((value) => {
            return value.dataGroupId === dataGroupId;
        });

        if (findIndex < 0) {
            throw new Error(`Couldn't find transform session with data group id ${dataGroupId}`);
        }

        const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
        pluginContext.deactivate(this.transformSessions[findIndex].pluginPackage,
            this.transformSessions[findIndex].plugin)
            .then(() => { })
            .catch(() => { });

        this.transformSessions.splice(findIndex, 1);
    }

    create(dataGroupId: number, pluginPackage: PluginPackage,
           plugin: Plugin,
           inputs: { [id: string]: PluginData; }): Promise<TransformSession> {
        return new Promise<TransformSession>(async (resolve, reject) => {
            const findIndex = this.transformSessions.findIndex((value) => {
                return value.dataGroupId === dataGroupId;
            });
            if (findIndex >= 0) {
                reject(new Error(`Experiment with id ${dataGroupId} already has a transform session.`));
            }
            try {
                const pluginContext = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
                const transformPlugin = await pluginContext.activate<TransformPlugin>(pluginPackage, plugin);

                const inputObj = transformPlugin.getInputs();
                inputObj.submit(inputs);

                const session = new TransformSession({
                    dataGroupId,
                    plugin,
                    pluginPackage,
                    transformPlugin
                });
                this.transformSessions.push(session);
                resolve(session);
            } catch (error) {
                reject(error);
            }
        });
    }


}

