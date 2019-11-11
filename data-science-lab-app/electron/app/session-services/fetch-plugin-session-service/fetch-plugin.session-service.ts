import { FetchSession } from '../../models/fetch-session';
import { Plugin, PluginPackage } from '../../../../shared/models';

export interface FetchPluginSessionService {
    read(experimentId: number): FetchSession;
    create(experimentId: number): FetchSession;
    select(experimentId: number, pluginPackage: PluginPackage, plugin: Plugin): Promise<FetchSession>;
    deselect(experimentId: number): FetchSession;
    delete(experimentId: number): void;
}

