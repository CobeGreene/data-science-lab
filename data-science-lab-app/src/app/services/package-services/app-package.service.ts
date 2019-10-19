import { PackageService } from './package.service';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import * as PluginsEvents from '../../../../shared/events/plugins-events';
import * as ErrorEvents from '../../../../shared/events/error-events';
import { OnDestroy, Injectable, NgZone } from '@angular/core';
import { IpService } from '../../../../shared/services/ip.service';
import { Subject } from 'rxjs';
import { deserialize } from 'typescript-json-serializer';

@Injectable()
export class AppPackageService implements PackageService, OnDestroy {
    public packagesChanged: Subject<PluginPackageList>;

    private packagesList: PluginPackageList;
    private retrieve: boolean;

    constructor(private ipService: IpService, private zone: NgZone) {
        this.packagesChanged = new Subject<PluginPackageList>();
        this.packagesList = new PluginPackageList();
        this.retrieve = false;
        this.registerGetAll();
    }

    ngOnDestroy(): void {
        this.unregisterGetAll();
    }
    
    all(): PluginPackageList {
        if (!this.retrieve) {
            this.ipService.send(PluginsEvents.GetAllEvent);
        }
        return this.packagesList;
    }

    install(name: string): void {
        this.ipService.send(PluginsEvents.InstallEvent, name);
    }

    uninstall(name: string): void {
        this.ipService.send(PluginsEvents.UninstallEvent, name);
    }

    get(name: string): PluginPackage {
        const find = this.packagesList.packages.find((value: PluginPackage) => {
            return value.name === name;
        });
        
        if (find == null) {
            throw new Error('Couldn\'t find plugin');
        }
        return find;
    }

    private registerGetAll(): void {
        this.ipService.on(PluginsEvents.GetAllListeners, this.getAllEvent);
    }   
    
    private unregisterGetAll(): void {
        this.ipService.removeListener(PluginsEvents.GetAllListeners, this.getAllEvent);
    }

    private getAllEvent = (event, arg): void => {
        this.zone.run(() => {
            try {
                const value = deserialize<PluginPackageList>(arg[0], PluginPackageList);
                this.packagesList = value;
                this.retrieve = true;
                this.packagesChanged.next(this.all());
            } catch (exception) {
                if (exception instanceof Error) {
                    this.ipService.send(ErrorEvents.ExceptionListeners, exception.message);
                } else {
                    this.ipService.send(ErrorEvents.ExceptionListeners, exception);   
                }
            }

        });
    }

} 
