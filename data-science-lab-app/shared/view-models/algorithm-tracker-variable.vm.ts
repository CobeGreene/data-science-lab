

export class AlgorithmTrackerVariableViewModel {

    public label: string;
    public description?: string;
    public values: any[];
    
    constructor(variable: {
        label: string,
        description?: string,
        values?: any[]
    }) {
        this.label = variable.label;
        this.description = variable.description;
        this.values = variable.values || [];
    }

}
