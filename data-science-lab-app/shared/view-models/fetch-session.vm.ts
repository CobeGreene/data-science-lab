import { OptionList } from 'data-science-lab-core';

export class FetchSessionViewModel {

    public experimentId: number;
    public optionList: OptionList;

    constructor(vm: {
        experimentId: number, optionList: OptionList
    }) {
        this.experimentId = vm.experimentId;
        this.optionList = vm.optionList;
    }
}
