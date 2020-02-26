import { ServiceContainer, SERVICE_TYPES, Service } from '../../service-container';
import { DatasetDataService } from './dataset.data-service';
import { PluginData } from 'data-science-lab-core';
import { DatasetObject } from '../../models';
import { Dataset,  } from '../../../../shared/models';
import { Settings } from '../../../../shared/settings';
import { SettingsContext } from '../../contexts/settings-context';
import { UserSettingDataService } from '../../data-services/user-setting-data-service';
import { IdGenerator } from '../../data-structures';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import { PluginDataConverter } from '../../converters/plugin-data-converter/plugin-data.converter';


export class AppDatasetDataService extends Service implements DatasetDataService {
    private readonly key = 'datasets';
    private readonly path = 'datasets-path';

    private datasets: DatasetObject[];
    private idGenerator: IdGenerator;

    get context(): SettingsContext {
        return this.serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    get user(): UserSettingDataService {
        return this.serviceContainer.resolve<UserSettingDataService>(SERVICE_TYPES.UserSettingDataService); 
    }

    get converter(): PluginDataConverter {
        return this.serviceContainer.resolve<PluginDataConverter>(SERVICE_TYPES.PluginDataConverter);
    }

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.datasets = [];
        this.idGenerator = new IdGenerator();
    }

    configure() {
        const id = this.context.get<number>(this.key, 1);
        this.idGenerator = new IdGenerator(id);
    }

    all(): DatasetObject[];
    // tslint:disable-next-line: unified-signatures
    all(experimentId: number): DatasetObject[];
    all(experimentId?: number): DatasetObject[] {
        if (experimentId === undefined) {
            return this.datasets;
        }
        return this.datasets.filter((value) => value.experimentId === experimentId);
    }

    create(experimentId: number, data: PluginData): number [] {
        const datasets = this.converter.convert(data);

        datasets.forEach((value) => {
            const setting = this.user.find(Settings.DatasetDefaultPreview);
            const defaultPreview = (setting === undefined) ? 10 : setting.value;
            value.id = this.idGenerator.next();
            value.experimentId = experimentId;
            value.previewExamples = (defaultPreview < value.examples) ? defaultPreview : value.examples;
        });

        this.datasets.push(...datasets);

        this.saveGenerator();
        return datasets.map(value => value.id);
    }

    load(experimentId: number): void {

    }

    save(experimentId: number): void {

    }

    get(id: number): DatasetObject {
        const find = this.datasets.find(value => value.id === id);
        if (find === undefined) {
            throw this.notFound(id);
        }
        return find;
    }

    delete(id: number): void {
        const find = this.datasets.findIndex(value => value.id === id);
        if (find >= 0) {
            this.datasets.splice(find, 1);
        } else {
            throw this.notFound(id);
        }
    }

    view(id: number): Dataset {
        const obj = this.get(id);
        const features = obj.features.map(value => ({
            name: value.name,
            type: value.type
        }));

        const previewExamples: any[][] = [];

        for (let example = 0; example < obj.previewExamples; ++example) {
            previewExamples.push([]);
            for (const feature of obj.features) {
                previewExamples[example].push(feature.examples[example]);
            }
        }

        return {
            id,
            experimentId: obj.experimentId,
            name: obj.name,
            examples: obj.examples,
            features,
            previewExamples: []
        };
    }

    saveGenerator() {
        this.context.set(this.key, this.idGenerator.at());
    }

    notFound(id: number): SystemError {
        return {
            header: 'Dataset Error',
            description: `Couldn't find dataset with id ${id}`,
            type: ErrorTypes.Error
        };
    }

}



