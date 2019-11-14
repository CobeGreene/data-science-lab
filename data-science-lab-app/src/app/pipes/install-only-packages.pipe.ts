import { Pipe, PipeTransform } from '@angular/core';
import { PluginPackage } from '../../../shared/models';

@Pipe({
    name: 'installOnlyPackage',
})
export class InstallOnlyPackagesPipe implements PipeTransform {
    transform(value: PluginPackage[], only: boolean = true) {
        if (only) {
            return value.filter((pluginPackage) => {
                return pluginPackage.install;
            });
        } else {
            return value;
        }
    }
}
