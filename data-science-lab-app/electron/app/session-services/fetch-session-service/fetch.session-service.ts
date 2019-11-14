import { FetchSession } from '../../models/fetch-session';
import { Plugin, PluginPackage } from '../../../../shared/models';

export interface FetchSessionService {
    all(): FetchSession[];
    read(experimentId: number): FetchSession;
    create(experimentId: number, pluginPackage: PluginPackage, plugin: Plugin): Promise<FetchSession>;
    delete(experimentId: number): void;
}

