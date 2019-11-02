import { ExperimentSelectFetchService } from './experiment-select-fetch.service';
import { Plugin, PluginPackageList, ExperimentStages } from '../../../../shared/models';
import { ExperimentProducer, ExperimentSelectFetchProducer } from '../../producers';
import { SettingService } from '../setting-services/setting.service';
import { AppPackageService } from '../package-service/app-package.service';
import { PluginTypes, FetchPlugin } from 'data-science-lab-core';
import { PluginManagerAdapter } from '../../adapters';
import { ExperimentDataService } from '../experiment-data-service';
import { ExperimentConverter } from '../../converters';
import { ExperimentsEvents } from '../../../../shared/events';

export class AppExerimentSelectFetchService implements ExperimentSelectFetchService {

    private experimentProducer: ExperimentProducer;
    private experimentSelectFetchProducer: ExperimentSelectFetchProducer;
    private settingService: SettingService;
    private pluginManagerAdapter: PluginManagerAdapter;
    private experimentDataService: ExperimentDataService;
    private experimentConverter: ExperimentConverter;

    constructor(experimentProducer: ExperimentProducer,
                experimentSelectFetchProducer: ExperimentSelectFetchProducer,
                settingService: SettingService,
                pluginManagerAdapter: PluginManagerAdapter,
                experimentDataService: ExperimentDataService,
                experimentConveter: ExperimentConverter) {
        this.experimentProducer = experimentProducer;
        this.experimentSelectFetchProducer = experimentSelectFetchProducer;
        this.settingService = settingService;
        this.pluginManagerAdapter = pluginManagerAdapter;
        this.experimentDataService = experimentDataService;
        this.experimentConverter = experimentConveter;
    }

    all(): void {
        const packageList = this.settingService.get(AppPackageService.INSTALL_PACKAGES, new PluginPackageList());

        const plugins: Plugin[] = [];

        packageList.packages.forEach((value) => {
            value.plugins.forEach((plugin) => {
                if (plugin.type === PluginTypes.Fetch) {
                    plugin.packageName = value.name;
                    plugins.push(plugin);
                }
            });
        });
        this.experimentSelectFetchProducer.all(plugins);
    }

    select(id: number, plugin: Plugin) {
        console.log(`Enter: ${id}`);
        const packageList = this.settingService.get(AppPackageService.INSTALL_PACKAGES, new PluginPackageList());
        const pluginPackage = packageList.packages.find((value) => {
            return plugin.packageName === value.name;
        });
        if (!pluginPackage) {
            this.experimentProducer.error('Couldn\'t find plugin that was selected.');
            return;
        }

        const experimentData = this.experimentDataService.get(id);
        if (experimentData == null) {
            this.experimentProducer.error('Couldn\'t find experiment that was selected.');
        }
        console.log(`Found experiment and plugin package`);
        this.pluginManagerAdapter.activate<FetchPlugin>(pluginPackage, plugin)
            .then((fetchPlugin: FetchPlugin) => {
                console.log(`Got fetch plugin`);
                experimentData.fetchPluginChoice = plugin;
                experimentData.fetchPlugin = fetchPlugin;
                experimentData.stage = ExperimentStages.Setup_Fetch;
                const experiment = this.experimentConverter.convert(experimentData);
                this.experimentDataService.update(id, experimentData);
                this.experimentProducer.update(experiment);
            }).catch((reason: any) => {
                this.experimentSelectFetchProducer.error(reason);
            });
    }


}
