import { Option } from './option';
import { OptionTypes } from './option-types';

export class NumberOption extends Option {
    public min: number;
    public max: number;
    public step: number;

    constructor(option: { id: string, label: string, min: number, max: number, step?: number}) {
        super({id: option.id, label: option.label, type: OptionTypes.Number});
        this.min = option.min;
        this.max = option.max;
        this.step = option.step || 1;
    }
}
