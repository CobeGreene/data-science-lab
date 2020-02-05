export class PluginInputViewModel {
    public id: string;
    public label: string;
    public type: string;
    public min: number;
    public max?: number;

    constructor(vm: {
        id: string, label: string, type: string,
        min: number, max?: number
    }) {
        this.id = vm.id;
        this.label = vm.label;
        this.type = vm.type;
        this.min = vm.min;
        this.max = vm.max;
    }
}