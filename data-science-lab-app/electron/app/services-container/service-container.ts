import { PackageConsumer } from '../consumers/package-consumer/package.consumer';
import { AppPackageConsumer } from '../consumers/package-consumer/app-package.consumer';
import { PackageService } from '../services/package-service/package.service';
import { AppPackageService } from '../services/package-service/app-package.service';
import { PackageProducer } from '../producers/package-producer/package.producer';
import { AppPackageProducer } from '../producers/package-producer/app-package.producer';
import { WebService } from 'data-science-lab-core';
import { AppWebService } from '../services/web-services/app-web.service';
import { SettingService } from '../services/setting-services/setting.service';
import { AppSettingService } from '../services/setting-services/app-setting.service';
import { IpcService } from '../../../shared/services';
import { AppIpcService } from '../services/app-ipc-service/app-ipc.service';
import { Consumer } from '../consumers/consumer';

export class ServiceContainer {

    private ipcService: IpcService;
    private consumers: Consumer[];

    constructor() {
        this.consumers = [];
    }

    configure() {
        console.log('configuring');
        

        this.ipcService = new AppIpcService();
        const settingService = new AppSettingService();

        // Producers
        const packageProducer = new AppPackageProducer(this.ipcService);

        // Services
        const webService = new AppWebService();

        const packageService = new AppPackageService(packageProducer, settingService, webService);

        // Consumers
        this.consumers = [
            new AppPackageConsumer(packageService, this.ipcService)
        ];

    }

    // resolve<T>(symbol: string | symbol): T {
    //     return this.container.get<T>(symbol);
    // }

    public getIpcService(): IpcService {
        return this.ipcService;
    }

    public getConsumers(): Consumer[] {
        return this.consumers;
    }
}
