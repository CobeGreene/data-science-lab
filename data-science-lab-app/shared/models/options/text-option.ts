import { Option } from './option';
import { OptionTypes } from './option-types';

export class TextOption extends Option {

    public maxLength?: number;

    constructor(option: { id: string, label: string, maxLength?: number }) {
        super({ id: option.id, label: option.label, type: OptionTypes.Text });
        this.maxLength = option.maxLength;
    }
}
