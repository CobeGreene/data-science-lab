import { AppPackageService } from '../services/package-service/app-package.service';
import { AppPackageProducer } from '../producers/package-producer/app-package.producer';
import { AppWebService } from '../services/web-services/app-web.service';
import { AppSettingService } from '../services/setting-services/app-setting.service';
import { IpcService } from '../../../shared/services';
import { AppIpcService, AppExerimentSelectFetchService } from '../services';
import { Consumer, AppExperimentConsumer, AppPackageConsumer, AppExperimentSelectFetchConsumer } from '../consumers';
import { AppPluginManagerAdapter, AppQueuePluginManagerAdpater } from '../adapters';
import { AppExperimentConverter } from '../converters';
import { AppExperimentProducer, AppExperimentSelectFetchProducer } from '../producers';
import { AppExperimentService } from '../services/experiment-service';
import { AppExperimentDataService } from '../services/experiment-data-service';

export class ServiceContainer {

    private ipcService: IpcService;
    private consumers: Consumer[];

    constructor() {
        this.consumers = [];
    }

    configure() {

        this.ipcService = new AppIpcService();
        const settingService = new AppSettingService();

        // Converters
        const experimentConverter = new AppExperimentConverter();        

        // Adapters
        const pluginManagerAdapter = new AppPluginManagerAdapter(settingService.get<string>('plugins-package'));
        const queuePluginManagerAdapter = new AppQueuePluginManagerAdpater(pluginManagerAdapter);

        // Producers
        const packageProducer = new AppPackageProducer(this.ipcService);
        const experimentProducer = new AppExperimentProducer(this.ipcService);
        const experimentSelectFetchProducer = new AppExperimentSelectFetchProducer(this.ipcService);

        // Services
        const webService = new AppWebService();
        const experimentDataService = new AppExperimentDataService();

        const packageService = new AppPackageService(packageProducer, settingService, webService, pluginManagerAdapter);
        const experimentService = new AppExperimentService(experimentDataService, experimentProducer, experimentConverter);
        const experimentSelectFetchService = new AppExerimentSelectFetchService(experimentProducer,
             experimentSelectFetchProducer, settingService, queuePluginManagerAdapter, experimentDataService,
             experimentConverter);

        // Consumers
        this.consumers = [
            new AppPackageConsumer(packageService, this.ipcService),
            new AppExperimentConsumer(experimentService, this.ipcService),
            new AppExperimentSelectFetchConsumer(experimentSelectFetchService, this.ipcService),
        ];

    }

    public getIpcService(): IpcService {
        return this.ipcService;
    }

    public getConsumers(): Consumer[] {
        return this.consumers;
    }
}
