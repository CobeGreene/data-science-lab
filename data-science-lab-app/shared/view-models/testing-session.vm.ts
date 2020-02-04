import { PluginInputViewModel } from './plugin-input.vm';


export class TestingSessionViewModel {
    public id: number;
    public dataGroupId: number;
    public inputs: PluginInputViewModel[];
    public output: PluginInputViewModel[];

    constructor(vm: {
        id: number,
        dataGroupId: number,
        inputs: PluginInputViewModel[],
        output: PluginInputViewModel[]
    }) {
        this.id = vm.id;
        this.dataGroupId = vm.dataGroupId;
        this.inputs = vm.inputs;
        this.output = vm.output;
    }
}
