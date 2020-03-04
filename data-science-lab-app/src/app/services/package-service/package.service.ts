import { Package } from '../../../../shared/models';
import { Service } from '../service';
import { Subject } from 'rxjs';
import { Messenger } from '../messenger';
import { NgZone } from '@angular/core';

export abstract class PackageService extends Service {
    packagesChanged: Subject<Package[]>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.packagesChanged = new Subject<Package[]>();
    }

    destorySubjects() {
        this.packagesChanged.complete();
    }

    abstract all(): Package[];
    abstract get(name: string): Package;
    abstract install(pluginPackage: Package): void;
    abstract uninstall(pluginPackage: Package): void;
}
