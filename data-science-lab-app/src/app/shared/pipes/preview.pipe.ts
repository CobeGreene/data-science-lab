import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'preview' })
export class PreviewPipe implements PipeTransform {
    transform(value: any, type: string, length: number): string {
        const json = JSON.stringify(value);
        if (json.length < length) {
            return json;
        }
        switch (type) {
            case 'number':
                return json.substr(0, length);
            case 'string':
                return `${json.substr(0, length - 5)} ...\"`;
            case 'boolean':
                return `${json.substr(0, length - 4)} ...`;
            case 'object':
                return `${json.substr(0, length - 5)} ...}`;
            default:
                return `${json.substr(0, length - 5)} ...]`;
        }
    }
}
