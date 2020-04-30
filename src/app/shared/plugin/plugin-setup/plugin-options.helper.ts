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
        return !value || (value.length <= option.min && !!value.match(option.pattern)); 
    } else if (!option.min && !option.max && option.pattern) {
        return !value || !!(value.match(option.pattern));
    } else {
        return false;
    }

    // if (!option.min || option.min === 0) {
    //     if (!value && !option.max) {

    //     }
    //     if (!value && !option.max) {
    //         return true;
    //     } else if (option.max && value.length <= option.max) {
    //         if (!option.pattern) {
    //             return true;
    //         }
    //         return value.match(option.pattern).length > 0;
    //     } else if (option.max && value.length > option.max) {
    //         return false;
    //     }
    // } else if (!value && value.length >= option.min) {
    //     if (option.max && value.length <= option.max) {
    //         if (!option.pattern) {
    //             return true;
    //         }
    //         return value.match(option.pattern).length > 0;
    //     }
    //     if (!option.pattern) {
    //         return true;
    //     }
    //     return value.match(option.pattern).length > 0;
    // }
    // if (!option.pattern) {
    //     return true;
    // }
    // return value.match(option.pattern).length > 0;
}