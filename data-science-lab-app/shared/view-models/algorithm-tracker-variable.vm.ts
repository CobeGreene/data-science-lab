

export class AlgorithmTrackerVariableViewModel {

    public label: string;
    public description?: string;
    public values: any[];
    public type: string;
    
    constructor(variable: {
        label: string,
        description?: string,
        values?: any[],
        type: string
    }) {
        this.label = variable.label;
        this.description = variable.description;
        this.values = variable.values || [];
        this.type = variable.type;
    }

}
