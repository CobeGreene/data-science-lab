import { OptionTypes } from './option-types';

export abstract class Option {
    public id: string;
    public label: string;
    public type: OptionTypes;

    constructor(option: {id: string, label: string, type: OptionTypes}) {
        this.id = option.id;
        this.label = option.label;
        this.type = option.type;
    }
}
