import { NgZone, Injectable } from '@angular/core';
import { SessionPluginService } from './session-plugin.service';
import { SessionPlugin, Feature } from '../../../../shared/models';
import { Messenger } from '../messenger';
import { PackageEvents } from '../../../../shared/events';

@Injectable()
export class AppSessionPluginService extends SessionPluginService {
    private plugins: SessionPlugin[];

    constructor(messenger: Messenger, zone: NgZone) {
        super(messenger, zone);

        this.plugins = [];
        this.registerEvents();
        this.messenger.publish(PackageEvents.SessionAll);
    }

    registerEvents() {
        this.messenger.subscribe(PackageEvents.SessionAll, this.allEvent);
        this.messenger.subscribe(PackageEvents.SessionChange, this.changeEvent);
    }

    unregisterEvents() {
        this.messenger.unsubscribe(PackageEvents.SessionAll, this.allEvent);
        this.messenger.unsubscribe(PackageEvents.SessionChange, this.changeEvent);
    }

    private allEvent = (_event, plugins: SessionPlugin[]) => {
        this.zone.run(() => {
            this.plugins = plugins;
            this.pluginsChanged.next(this.plugins);
        });
    }

    private changeEvent = (_event) => {
        this.zone.run(() => {
            this.messenger.publish(PackageEvents.SessionAll);
        });
    }

    all(): SessionPlugin[];
    // tslint:disable-next-line: unified-signatures
    all(type: string): SessionPlugin[];
    all(type?: string): SessionPlugin[] {
        if (type === undefined) {
            return this.plugins;
        }
        return this.plugins.filter((value) => value.type === type);
    }

    get(name: string): SessionPlugin {
        const find = this.plugins.find((value) => {
            return value.name === name;
        });

        if (find === undefined) {
            throw new Error(`Couldn't find session plugin with name ${name}`);
        }
        return find;
    }

    compatible(type: string, selectedfeatures: Feature[]): SessionPlugin[] {
        return this.all(type).filter((plugin) => {
            const features = selectedfeatures.slice();
            for (const input of plugin.inputs) {
                for (let i = 0; i < input.min; ++i) {
                    const index = features.findIndex(feature => {
                        return feature.type === input.type;
                    });
                    if (index >= 0) {
                        features.splice(index, 1);
                    } else {
                        return false;
                    }
                }
            }
            return true;
        });
    }
}
