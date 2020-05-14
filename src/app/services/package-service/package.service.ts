import { Package } from '../../../../shared/models';
import { Service } from '../service';
import { Subject } from 'rxjs';
import { Messenger } from '../messenger';
import { NgZone } from '@angular/core';

export abstract class PackageService extends Service {
    packagesChanged: Subject<Package[]>;
    featureChanged: Subject<Package[]>;
    packageGet: Subject<Package>;

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.packagesChanged = new Subject<Package[]>();
        this.featureChanged = new Subject<Package[]>();
        this.packageGet = new Subject<Package>();
    }

    destorySubjects() {
        this.packagesChanged.complete();
        this.featureChanged.complete();
        this.packageGet.complete();
    }

    abstract all(): Package[];
    abstract get(name: string): Package;
    abstract install(pluginPackage: Package): void;
    abstract uninstall(pluginPackage: Package): void;
    abstract feature(): void;
    abstract featurePackages(): Package[];
    abstract search(search: string, type: string, page: number): void;
    abstract fetch(name: string): void;
}
