import { Package } from '../../../../shared/models';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'packageSearch' })
export class PackageSearchPipe implements PipeTransform {
    transform(packages: Package[], search: string, type: string): Package[] {
        if (packages === undefined) {
            return packages;
        } 
        if (search !== undefined && search.length > 0) {
            packages = packages.filter((value) => value.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
        }

        if (type !== 'All') {
            packages = packages.filter((value) => value.plugins.findIndex((plugin) => plugin.type === type) >= 0);
        }
        return packages;
    }
}
