import { Plugin } from '../models/plugin';
import { PluginInputViewModel } from './plugin-input.vm';



export class AlgorithmPluginViewModel {
    public plugin: Plugin;
    public inputs: PluginInputViewModel[];

    constructor(vm: {
        plugin: Plugin, inputs?: PluginInputViewModel[]
    }) { 
        this.plugin = vm.plugin;
        this.inputs = vm.inputs || [];
    }
   
}

