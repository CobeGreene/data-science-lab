

export class VariableViewModel {
    id: number;
    label: string;
    description?: string;
    type: string;
    values: any[];

    constructor(vm: {
        id?: number,
        label: string,
        description?: string,
        type: string,
        values?: any[]
    }) {
        this.id = vm.id || 0;
        this.label = vm.label;
        this.description = vm.description;
        this.type = vm.type;
        this.values = this.values || [];
    }
}

