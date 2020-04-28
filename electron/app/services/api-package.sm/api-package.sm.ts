import { ServiceModel } from "../service-model";
import { ServiceModelRoutes, Producer } from "../../pipeline";
import { SERVICE_TYPES, ServiceContainer } from "../../service-container";
import { WebService, Response } from "data-science-lab-core";
import { SettingsContext } from "../../contexts/settings-context";
import { ApiSettings } from "../../models";
import { PackageDataService } from "../../data-services/package-data-service";
import { Package } from "../../../../shared/models";
import { SystemError, ErrorTypes } from "../../../../shared/errors";
import { PackageEvents, ErrorEvent } from '../../../../shared/events';

export class ApiPackageServiceModel extends ServiceModel {

    private readonly api = 'api-settings';

    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.ApiPackageServiceModel,
        routes: [
            { path: PackageEvents.Feature, method: 'feature' },
            { path: PackageEvents.Search, method: 'search' }
        ]
    };

    private webService: WebService;
    private packageService: PackageDataService;
    private settings: SettingsContext;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);
        this.packageService = serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        this.webService = serviceContainer.resolve<WebService>(SERVICE_TYPES.WebService);
        this.settings = serviceContainer.resolve<SettingsContext>(SERVICE_TYPES.SettingsContext);
    }

    async feature() {
        const api = this.settings.get<ApiSettings>(this.api);
        const response = await this.webService.send({
            method: 'GET',
            protocol: api.protocol,
            hostname: api.hostname,
            port: api.port,
            path: `${api.pathPackages}/feature`
        });

        if (response.statusCode === 200) {
            this.producer.send(PackageEvents.Feature, this.convert(response));
        } else {
            this.producer.send(ErrorEvent, this.unableConnect());
        }
    }

    async search(search: string, type: string, currentPage: number) {
        const api = this.settings.get<ApiSettings>(this.api);
        const response = await this.webService.send({
            method: 'GET',
            protocol: api.protocol,
            hostname: api.hostname,
            port: api.port,
            path: `${api.pathPackages}/search?search=${search}&type=${type}&currentpage=${currentPage}`
        });

        if (response.statusCode === 200) {
            this.producer.send(PackageEvents.Search, this.convert(response));
        } else {
            this.producer.send(ErrorEvent, this.unableConnect());
        }
    }

    unableConnect(): SystemError {
        return {
            header: 'API Connection',
            description: 'Unable to get packages from api will only used the ones install.',
            type: ErrorTypes.Warning
        };
    }

    convert(response: Response): Package[] {
        const obj = JSON.parse(response.body.toString()) as any[];
        const pluginPackages: Package[] = [];
        obj.forEach(element => {
            const find = this.packageService.has(element.name);

            pluginPackages.push({
                name: element.name,
                owner: element.owner,
                repositoryName: element.repositoryName,
                username: element.username,
                install: find,
                plugins: element.plugins.map(value => ({
                    name: value.name,
                    className: value.className,
                    description: value.description,
                    type: value.type,
                    packageName: element.name
                }))
            });
        });

        return pluginPackages;
    }
}