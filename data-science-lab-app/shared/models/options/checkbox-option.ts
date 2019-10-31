import { Option } from './option';
import { OptionTypes } from './option-types';

export class CheckboxOption extends Option {
    
    constructor(option: { id: string, label: string }) {
        super({ id: option.id, label: option.label, type: OptionTypes.Checkbox });
    }
}
