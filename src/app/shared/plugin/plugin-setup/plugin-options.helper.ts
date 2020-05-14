import { TextOption } from "data-science-lab-core";

export function isValidText(value: string, option: TextOption): boolean {
    if (!option.min && !option.max && !option.pattern) {
        return true;
    } else if (option.min && !option.max && !option.pattern) {
        return !!value && value.length >= option.min;
    } else if (option.min && option.max && !option.pattern) {
        return !!value && value.length >= option.min && value.length <= option.max;
    } else if (option.min && option.max && option.pattern) {
        return !!value && value.length >= option.min && value.length <= option.max && !!value.match(option.pattern);
    } else if (option.min && !option.max && option.pattern) {
        return !!value && value.length >= option.min && !!value.match(option.pattern);
    } else if (!option.min && option.max && !option.pattern) {
        return !value || value.length <= option.max;
    } else if (!option.min && option.max && option.pattern) {
        return !value || (value.length <= option.max && !!value.match(option.pattern)); 
    } else {
        // } else if (!option.min && !option.max && option.pattern) {
        return !value || !!(value.match(option.pattern));
    }

}