import { Option } from './option';
import { OptionTypes } from './option-types';

export class CommandOption extends Option {

    public methodName: string;

    constructor(option: { id: string, label: string, methodName: string }) {
        super({ id: option.id, label: option.label, type: OptionTypes.Command });
        this.methodName = option.methodName;
    }
}
