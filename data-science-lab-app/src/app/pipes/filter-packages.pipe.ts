import { Pipe, PipeTransform } from '@angular/core';
import { PluginPackage } from '../../../shared/models';

@Pipe({
    name: 'packageFilter',
})
export class FilterPackagesPipe implements PipeTransform {
    transform(value: PluginPackage[], filter: string): PluginPackage[] {
        if (!value) {
            return value;
        }
        
        if (!filter) {
            return value;
        }
        
        filter = filter.toLowerCase();
        return value.filter((pluginPackage) => {
            return pluginPackage.name.toLowerCase().includes(filter);
        });
    }
}




