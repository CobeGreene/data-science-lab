import { OptionList } from 'data-science-lab-core';

export class VisualizationSessionViewModel {
    public id: number;
    public optionList: OptionList;

    constructor(vm: {
        id: number,
        optionList: OptionList
    }) {
        this.id = vm.id;
        this.optionList = vm.optionList;
    }
}
