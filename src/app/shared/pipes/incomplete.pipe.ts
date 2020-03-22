import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'incomplete'})
export class IncompletePipe implements PipeTransform {
    transform(value: string, length: number): string {
        if (value === null || value === undefined) {
            return value;
        }
        if (value.length < length - 4) {
            return value;
        }
        return `${value.substr(0, length)} ...`;
    }
}
