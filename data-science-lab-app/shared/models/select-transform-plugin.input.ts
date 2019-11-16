

export class SelectTransformPluginInput {
    public id: string;
    public label: string;
    public type: string;
    public min: number;
    public max?: number;
    public dataGroupIndex?: number;

    constructor(pluginInput: {
        id: string, label: string, type: string,
        dataGroupIndex?: number, min: number, max?: number
    }) {
        this.id = pluginInput.id;
        this.label = pluginInput.label;
        this.type = pluginInput.type;
        this.dataGroupIndex  = pluginInput.dataGroupIndex;
        this.min = pluginInput.min;
        this.max = pluginInput.max;
    }
}

