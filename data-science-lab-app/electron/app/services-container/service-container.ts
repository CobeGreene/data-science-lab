import { AppPackageConsumer } from '../consumers/package-consumer/app-package.consumer';
import { AppPackageService } from '../services/package-service/app-package.service';
import { AppPackageProducer } from '../producers/package-producer/app-package.producer';
import { AppWebService } from '../services/web-services/app-web.service';
import { AppSettingService } from '../services/setting-services/app-setting.service';
import { IpcService } from '../../../shared/services';
import { AppIpcService } from '../services/app-ipc-service/app-ipc.service';
import { Consumer } from '../consumers/consumer';
import { AppPluginManagerAdapter } from '../adapters';

export class ServiceContainer {

    private ipcService: IpcService;
    private consumers: Consumer[];

    constructor() {
        this.consumers = [];
    }

    configure() {

        this.ipcService = new AppIpcService();
        const settingService = new AppSettingService();

        // Adapters
        const pluginManagerAdapter = new AppPluginManagerAdapter(settingService.get<string>('plugins-package'));

        // Producers
        const packageProducer = new AppPackageProducer(this.ipcService);

        // Services
        const webService = new AppWebService();

        const packageService = new AppPackageService(packageProducer, settingService, webService, pluginManagerAdapter);

        // Consumers
        this.consumers = [
            new AppPackageConsumer(packageService, this.ipcService)
        ];

    }

    public getIpcService(): IpcService {
        return this.ipcService;
    }

    public getConsumers(): Consumer[] {
        return this.consumers;
    }
}
