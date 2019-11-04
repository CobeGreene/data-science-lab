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
import { AppExperimentSetupInputService } from '../services/experiment-setup-input-service';
import { AppExperimentSetupInputConsumer } from '../consumers/experiment-setup-input-consumer/app-experiment-setup-input.consumer';
import { AppFileService } from '../services/file-services';

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
        const fileService = new AppFileService();

        const packageService = new AppPackageService(packageProducer, settingService, webService, pluginManagerAdapter);
        const experimentService = new AppExperimentService(experimentDataService, experimentProducer, experimentConverter);
        const experimentSelectFetchService = new AppExerimentSelectFetchService(experimentProducer,
             experimentSelectFetchProducer, settingService, queuePluginManagerAdapter, experimentDataService,
             experimentConverter, fileService);
        const experimentSetupInputService = new AppExperimentSetupInputService(experimentProducer,
            experimentDataService, experimentConverter);

        // Consumers
        this.consumers = [
            new AppPackageConsumer(packageService, this.ipcService),
            new AppExperimentConsumer(experimentService, this.ipcService),
            new AppExperimentSelectFetchConsumer(experimentSelectFetchService, this.ipcService),
            new AppExperimentSetupInputConsumer(experimentSetupInputService, this.ipcService),
        ];

    }

    public getIpcService(): IpcService {
        return this.ipcService;
    }

    public getConsumers(): Consumer[] {
        return this.consumers;
    }
}
