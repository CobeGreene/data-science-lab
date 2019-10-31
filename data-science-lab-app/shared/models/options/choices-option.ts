import { Option } from './option';
import { OptionTypes } from './option-types';

export class ChoicesOption extends Option {

    public choices: string[];

    constructor(option: { id: string, label: string, choices: string[]  }) {
        super({ id: option.id, label: option.label, type: OptionTypes.Choices });
        this.choices = option.choices;
    }
}
