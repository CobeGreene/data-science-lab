import { PackageService } from './package.service';
import { PluginPackage, PluginPackageList } from '../../../../shared/models';
import { PackagesEvents, ErrorEvents } from '../../../../shared/events';
import { OnDestroy, Injectable, NgZone } from '@angular/core';
import { IpcService } from '../../../../shared/services';
import { Subject } from 'rxjs';

@Injectable()
export class AppPackageService implements PackageService, OnDestroy {
    public packagesChanged: Subject<PluginPackageList>;

    private packagesList: PluginPackageList;
    private retrieve: boolean;

    constructor(private ipcService: IpcService, private zone: NgZone) {
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
            this.ipcService.send(PackagesEvents.GetAllEvent);
        }
        return this.packagesList;
    }

    install(pluginPackage: PluginPackage): void {
        this.ipcService.send(PackagesEvents.InstallEvent, pluginPackage);
    }

    uninstall(pluginPackage: PluginPackage): void {
        this.ipcService.send(PackagesEvents.UninstallEvent, pluginPackage);
    }

    get(name: string): PluginPackage {
        const find = this.packagesList.packages.find((value: PluginPackage) => {
            return value.name === name;
        });
        
        if (find == null) {
            throw new Error('Couldn\'t find package');
        }
        return find;
    }

    private registerGetAll(): void {
        this.ipcService.on(PackagesEvents.GetAllListeners, this.getAllEvent);
    }   
    
    private unregisterGetAll(): void {
        this.ipcService.removeListener(PackagesEvents.GetAllListeners, this.getAllEvent);
    }

    private getAllEvent = (event, pluginPackageList: PluginPackageList): void => {
        this.zone.run(() => {
            try {
                this.packagesList = pluginPackageList;
                this.retrieve = true;
                this.packagesChanged.next(this.all());
            } catch (exception) {
                if (exception instanceof Error) {
                    this.ipcService.send(ErrorEvents.ExceptionListeners, exception.message);
                } else {
                    this.ipcService.send(ErrorEvents.ExceptionListeners, exception);   
                }
            }

        });
    }

} 
