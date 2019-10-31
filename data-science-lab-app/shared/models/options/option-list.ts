import { Option } from './option';

export class OptionList {
    options: Option[];

    constructor(options: Option[] = []) {
        this.options = options;
    }
}
