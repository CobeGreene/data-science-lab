import { Option } from './option';
import { OptionTypes } from './option-types';

export class CommandOption extends Option {

    public command: string;

    constructor(option: { id: string, label: string, command: string }) {
        super({ id: option.id, label: option.label, type: OptionTypes.Command });
        this.command = option.command;
    }
}
