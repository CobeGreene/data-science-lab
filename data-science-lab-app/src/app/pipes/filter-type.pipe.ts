import { Pipe, PipeTransform } from '@angular/core';
import { PluginPackage } from '../../../shared/models';


@Pipe({
    name: 'typeFilter',
})
export class TypeFilterPipe implements PipeTransform {
    transform(value: PluginPackage[], type: string): PluginPackage[] {
        if (!value) {
            return value;
        }

        if (!type || type.length === 0) {
            return value;
        }

        return value.filter((pluginPackage) => {
            return pluginPackage.plugins.find((plugin) => {
                return plugin.type === type;
            });
        });
    }
}
