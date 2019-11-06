import { FetchPlugin } from 'data-science-lab-core';
import { Plugin } from '../../../shared/models';

export class FetchSession {
    public experimentId: number;
    public pluginInfo: Plugin;
    public fetchPlugin: FetchPlugin;
}
