import { TextOption } from "data-science-lab-core";

export function isValidText(value: string, option: TextOption): boolean {
    if (!option.min || option.min === 0) {
        if (!value || !option.max) {
            return true;
        } else if (option.max && value.length < option.max) {
            if (!option.pattern) {
                return true;
            }
            return value.match(option.pattern).length > 0;
        }
    } else if (!value && value.length >= option.min) {
        if (option.max && value.length < option.max) {
            if (!option.pattern) {
                return true;
            }
            return value.match(option.pattern).length > 0;
        }
        if (!option.pattern) {
            return true;
        }
        return value.match(option.pattern).length > 0;
    }
    if (!option.pattern) {
        return true;
    }
    return value.match(option.pattern).length > 0;
}