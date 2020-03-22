import { Plugin } from '../../../../shared/models';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pluginSearch' })
export class PluginSearchPipe implements PipeTransform {
    transform(pluginList: Plugin[], search: string): Plugin[] {
        if (pluginList && search.length > 0) {
            return pluginList.filter((value) => value.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
        }
        return pluginList;
    }
}
