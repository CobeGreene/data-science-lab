import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'packageBadge'})
export class PackageBadgePipe implements PipeTransform {
    transform(value: number): string {
        if (value < 1000) {
            return value.toString();
        } else if (value < 10 ** 6) {
            return '1k+';
        } else if (value < 10 ** 9) {
            return '1m+';
        }
        return '1b+';
    }
}
