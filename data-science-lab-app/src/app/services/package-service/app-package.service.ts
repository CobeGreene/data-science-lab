import { Injectable, NgZone } from '@angular/core';
import { PackageService } from './package.service';
import { Package } from '../../../../shared/models';
import { Messenger } from '../messenger';
import { PackageEvents } from '../../../../shared/events';

@Injectable()
export class AppPackageService extends PackageService {
    private packages: Package[];

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.packages = [];
        this.registerEvents();
        this.messenger.publish(PackageEvents.All);
    }

    registerEvents() {
        this.messenger.subscribe(PackageEvents.All, this.allEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(PackageEvents.All, this.allEvent);
    }

    private allEvent = (_event, packages: Package[]) => {
        this.zone.run(() => {
            this.packages = packages;
            this.packagesChanged.next(this.packages);
        });
    }

    all() {
        return this.packages;
    }

    get(name: string): Package {
        const find = this.packages.find((value) => value.name === name);
        if (find === undefined) {
            throw new Error(`Couldn't find package with name ${name}`);
        }
        return find;
    }

    install(pluginPackage: Package) {
        this.messenger.publish(PackageEvents.Install, pluginPackage);
    }

    uninstall(pluginPackage: Package) {
        this.messenger.publish(PackageEvents.Uninstall, pluginPackage);
    }
}


