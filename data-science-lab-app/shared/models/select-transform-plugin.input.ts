

export class SelectTransformPluginInput {
    public id: string;
    public label: string;
    public type: string;
    public dataGroupIndex?: number;

    constructor(pluginInput: {
        id: string, label: string, type: string,
        dataGroupIndex?: number
    }) {
        this.id = pluginInput.id;
        this.label = pluginInput.label;
        this.type = pluginInput.type;
        this.dataGroupIndex  = pluginInput.dataGroupIndex;
    }
}

