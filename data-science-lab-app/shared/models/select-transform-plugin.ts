import { Plugin } from './plugin';
import { SelectTransformPluginInput } from './select-transform-plugin.input';


export class SelectTransformPlugin {
    public plugin: Plugin;
    public inputs?: SelectTransformPluginInput[];

    constructor(transformPlugin: {
        plugin: Plugin, inputs?: SelectTransformPluginInput[]
    }) {
        this.plugin = transformPlugin.plugin;
        this.inputs = transformPlugin.inputs || [];
    }
}
