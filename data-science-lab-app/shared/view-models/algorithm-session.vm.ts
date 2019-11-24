import { OptionList } from 'data-science-lab-core';


export class AlgorithmSessionViewModel {
    public dataGroupId: number;
    public optionList: OptionList;

    constructor(vm: {
        dataGroupId: number,
        optionList: OptionList
    }) {
        this.dataGroupId = vm.dataGroupId;
        this.optionList = vm.optionList;
    }
}

