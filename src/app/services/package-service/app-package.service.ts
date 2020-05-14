import { Injectable, NgZone } from '@angular/core';
import { PackageService } from './package.service';
import { Package } from '../../../../shared/models';
import { Messenger } from '../messenger';
import { PackageEvents } from '../../../../shared/events';

@Injectable()
export class AppPackageService extends PackageService {
    
    private packages: Package[];
    private features: Package[];

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone)/* istanbul ignore next */;

        this.packages = [];
        this.features = [];
        this.registerEvents();
        this.messenger.publish(PackageEvents.All);
        this.messenger.publish(PackageEvents.Feature);
    }

    registerEvents() {
        this.messenger.subscribe(PackageEvents.All, this.allEvent);
        this.messenger.subscribe(PackageEvents.Change, this.changeEvent);
        this.messenger.subscribe(PackageEvents.Feature, this.featureEvent);
        this.messenger.subscribe(PackageEvents.Search, this.searchEvent);
        this.messenger.subscribe(PackageEvents.Get, this.getEvent);
    }
    
    unregisterEvents() {
        this.messenger.unsubscribe(PackageEvents.All, this.allEvent);
        this.messenger.unsubscribe(PackageEvents.Change, this.changeEvent);
        this.messenger.unsubscribe(PackageEvents.Feature, this.featureEvent);
        this.messenger.unsubscribe(PackageEvents.Search, this.searchEvent);
        this.messenger.unsubscribe(PackageEvents.Get, this.getEvent);
    }

    private allEvent = (_event, packages: Package[]) => {
        this.zone.run(() => {
            this.packages = packages;
            this.features.forEach((value) => {
                if (this.packages.findIndex((pluginPackage) => pluginPackage.name === value.name) >= 0) {
                    value.install = true;
                } else {
                    value.install = false;
                }
            })
            this.packagesChanged.next(this.packages);
            this.featureChanged.next(this.features);
        });
    }

    private featureEvent = (_event, packages: Package[]) => {
        this.zone.run(() => {
            this.features = packages;
            this.featureChanged.next(this.features);
        });
    }

    private getEvent = (_event, pluginPackage: Package) => {
        this.zone.run(() => {
            this.packageGet.next(pluginPackage);
        });
    }
    
    private searchEvent = (_event, packages: Package[]) => {
        this.zone.run(() => {
            this.features = packages;
            this.featureChanged.next(this.features);
        });
    }

    private changeEvent = (_event) => {
        this.messenger.publish(PackageEvents.All);
    }

    all() {
        return this.packages;
    }

    featurePackages(): Package[] {
        return this.features;
    }

    get(name: string): Package {
        let find = this.packages.find((value) => value.name === name);
        
        if (find === undefined) {
            throw new Error(`Couldn't find package with name ${name}`);
        }
        return find;
    }

    feature(): void {
        this.messenger.publish(PackageEvents.Feature);
    }

    search(search: string, type: string, page: number): void {
        this.messenger.publish(PackageEvents.Search, search, type, page);
    }

    install(pluginPackage: Package) {
        this.messenger.publish(PackageEvents.Install, pluginPackage);
    }

    uninstall(pluginPackage: Package) {
        this.messenger.publish(PackageEvents.Uninstall, pluginPackage);
    }

    fetch(name: string) {
        let find = this.packages.find((value) => value.name === name);
        if (find === undefined) {
            find = this.features.find((value) => value.name === name);
        }
        if (find === undefined) {
            this.messenger.publish(PackageEvents.Get, name);
        } else {
            this.packageGet.next(find);
        }
    }
}


