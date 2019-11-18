import { Pipe, PipeTransform } from '@angular/core';
import { SelectTransformPluginInput } from '../../../shared/models';


@Pipe({
    name: 'selectTransformType',
})
export class SelectTransformTypePipe implements PipeTransform {
    transform(values: SelectTransformPluginInput[], featureType: string) {
        return values.filter((value) => {
            return value.type === featureType;
        });
    }
}
