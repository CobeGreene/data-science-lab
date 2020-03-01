import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { ServiceModelRoutes, Producer } from '../../pipeline';
import { FetchEvents, ErrorEvent } from '../../../../shared/events';
import { ServiceModel } from '../../services/service-model';
import { SessionDataService } from '../../data-services/session-data-service';
import { PackageDataService } from '../../data-services/package-data-service';
import { Session, Plugin, SessionOptions, SessionState } from '../../../../shared/models';
import { PluginContext } from '../../contexts/plugin-context';
import { FetchPlugin, FileService } from 'data-science-lab-core';
import { SystemError, ErrorTypes } from '../../../../shared/errors';
import { DatasetDataService } from '../../data-services/dataset-data-service';

export class FetchServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.FetchServiceModel,
        routes: [
            { path: FetchEvents.Create, method: 'create' },
            { path: FetchEvents.Delete, method: 'delete' },
            { path: FetchEvents.Select, method: 'select' },
            { path: FetchEvents.Options, method: 'options' },
            { path: FetchEvents.Command, method: 'command' },
            { path: FetchEvents.Previous, method: 'previous' },
        ]
    };

    private dataService: SessionDataService;
    private packageService: PackageDataService;
    private context: PluginContext;
    private datasetService: DatasetDataService;

    private get fileService(): FileService {
        return this.serviceContainer.resolve<FileService>(SERVICE_TYPES.FileService);
    }

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.dataService = serviceContainer.resolve<SessionDataService>(SERVICE_TYPES.SessionDataService);
        this.packageService = serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        this.context = serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
        this.datasetService = serviceContainer.resolve<DatasetDataService>(SERVICE_TYPES.DatasetDataService);
    }

    create(experimentId: number, options: SessionOptions) {
        let session: Session = {
            id: 0,
            keyId: experimentId,
            isWaiting: false,
            sessionOptions: options,
            state: SessionState.Select,
        };

        session = this.dataService.post(session);
        this.producer.send(FetchEvents.Create, session);
    }

    delete(id: number) {
        this.dataService.delete(id);
        this.producer.send(FetchEvents.Delete, id);
    }

    async select(id: number, plugin: Plugin) {
        const session = this.dataService.get(id);

        const fetchPlugin = await this.context.activate<FetchPlugin>(this.packageService.find(plugin), plugin);
        fetchPlugin.setFileService(this.fileService);
        this.dataService.reference(id, fetchPlugin);

        if (fetchPlugin.getOptions().noMore()) {
            // session finish
            this.sessionFinish(session, fetchPlugin);
        } else {
            session.optionList = fetchPlugin.getOptions().options();
            session.plugin = plugin;
            session.state = SessionState.Setup;
            session.isWaiting = false;
            this.producer.send(FetchEvents.Update, session);
        }
    }

    async command(id: number, command: string) {
        const session = this.dataService.get(id);

        const fetchPlugin = this.dataService.reference<FetchPlugin>(id);

        await fetchPlugin.getOptions().executeCommand(command);

        if (fetchPlugin.getOptions().noMore()) {
            // session finish
            this.sessionFinish(session, fetchPlugin);
        } else {
            session.optionList = fetchPlugin.getOptions().options();
            session.isWaiting = false;
            this.producer.send(FetchEvents.Update, session);
        }
    }

    options(id: number, inputs: { [id: string]: any; }) {
        const session = this.dataService.get(id);

        const fetchPlugin = this.dataService.reference<FetchPlugin>(id);

        fetchPlugin.getOptions().submit(inputs);
        
        if (fetchPlugin.getOptions().noMore()) {
            // session finish
            this.sessionFinish(session, fetchPlugin);
        } else {
            session.optionList = fetchPlugin.getOptions().options();
            session.isWaiting = false;
            this.producer.send(FetchEvents.Update, session);
        }
    }

    async previous(id: number) {
        const session = this.dataService.get(id);

        if (session.state === SessionState.Select) {
            this.dataService.delete(id);
            this.producer.send(FetchEvents.Finish, id);
        } else if (session.state === SessionState.Setup) {
            await this.context.deactivate(this.packageService.find(session.plugin), session.plugin);
            session.state = SessionState.Select;
            session.optionList = undefined;
            session.isWaiting = false;
            this.producer.send(FetchEvents.Update, session);
        } else {
            const error: SystemError = {
                header: 'Fetch Session Error',
                description: 'Fetch session is in invalid state',
                type: ErrorTypes.Error
            };
            this.producer.send(ErrorEvent, error);
        }
    }

    sessionFinish(session: Session, plugin: FetchPlugin) {
        const data = plugin.fetch();
        const ids = this.datasetService.create(session.keyId, data);
        this.dataService.delete(session.id);
        this.producer.send(FetchEvents.Finish, session.id);
    }
}
