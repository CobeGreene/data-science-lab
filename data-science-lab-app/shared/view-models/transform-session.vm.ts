import { OptionList } from 'data-science-lab-core';

export class TransformSessionViewModel {
    public experimentId: number;
    public dataGroupId: number;

    public optionList: OptionList;

    constructor(vm: {
        experimentId: number, dataGroupId: number,
        optionList: OptionList
    }) {
        this.experimentId = vm.experimentId;
        this.dataGroupId = vm.dataGroupId;
        this.optionList = vm.optionList;
    }
}
