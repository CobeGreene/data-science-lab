import { Pipe, PipeTransform } from '@angular/core';
import { PluginInputViewModel } from '../../../shared/view-models';


@Pipe({
    name: 'selectTransformType',
})
export class SelectTransformTypePipe implements PipeTransform {
    transform(values: PluginInputViewModel[], featureType: string) {
        return values.filter((value) => {
            return value.type === featureType;
        });
    }
}
