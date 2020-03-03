import { ServiceModel } from '../services/service-model';
import { ServiceContainer, SERVICE_TYPES } from '../service-container';
import { Producer } from '../pipeline';
import { SessionDataService } from '../data-services/session-data-service';
import { PackageDataService } from '../data-services/package-data-service';
import { PluginContext } from '../contexts/plugin-context';
import { SessionOptions, Session, SessionState, Plugin, SessionPlugin } from '../../../shared/models';
import { ErrorEvent } from '../../../shared/events';
import { ErrorTypes } from '../../../shared/errors';


export abstract class SessionService extends ServiceModel {

    protected dataService: SessionDataService;
    protected packageService: PackageDataService;
    protected context: PluginContext;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.dataService = serviceContainer.resolve<SessionDataService>(SERVICE_TYPES.SessionDataService);
        this.packageService = serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
        this.context = serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
    }

    abstract get eventCreate(): string;
    abstract get eventUpdate(): string;
    abstract get eventDelete(): string;
    abstract get eventFinish(): string;
    abstract get eventSelect(): string;
    abstract get eventOptions(): string;
    abstract get eventCommand(): string;
    abstract get eventInputs(): string;
    abstract get eventPrevious(): string;

    abstract pluginActivate(plugin: any): Promise<void>;
    abstract sessionFinish(session: Session, plugin: any): Promise<void>;

    create(keyId: number, options: SessionOptions, features?: number[], returnPath?: string) {
        let session: Session = {
            id: 0,
            keyId,
            isWaiting: false,
            sessionOptions: options,
            state: SessionState.Select,
            selectedFeatures: features,
            returnPath,
        };

        session = this.dataService.post(session);
        this.producer.send(this.eventCreate, session);
    }

    async delete(id: number) {
        const session = this.dataService.get(id);
        this.dataService.delete(id);
        if (session.plugin !== undefined) {
            await this.deactivatePlugin(session.plugin);
        }
        this.producer.send(this.eventDelete, id);
    }

    async select(id: number, plugin: SessionPlugin | Plugin) {
        await this.eventWrapper(async () => {
            const session = this.dataService.get(id);
            session.plugin = plugin;
            session.isWaiting = false;

            const sessionPlugin = await this.context.activate<any>(this.packageService.find(plugin), plugin);

            await this.pluginActivate(sessionPlugin);

            this.dataService.reference(id, sessionPlugin);

            if (plugin.hasOwnProperty('inputs')) {
            
                session.state = SessionState.Input;
                this.dataService.update(session);
                this.producer.send(this.eventUpdate, session);
            
            } else if (sessionPlugin.getOptions().noMore()) {

                await this.sessionFinishWrapper(session, sessionPlugin);
            
            } else {
            
                session.optionList = sessionPlugin.getOptions().options();
                session.state = SessionState.Setup;
                this.dataService.update(session);
                this.producer.send(this.eventUpdate, session);
            
            }
        });
    }

    async command(id: number, command: string) {
        await this.eventWrapper(async () => {
            const session = this.dataService.get(id);
            const sessionPlugin = this.dataService.reference<any>(id);

            await sessionPlugin.getOptions().executeCommand(command);

            if (sessionPlugin.getOptions().noMore()) {
                
                await this.sessionFinishWrapper(session, sessionPlugin);

            } else {
                session.optionList = sessionPlugin.getOptions().options();
                session.state = SessionState.Setup;
                session.isWaiting = false;
                this.dataService.update(session);
                this.producer.send(this.eventUpdate, session);
            }
        });
    }

    async inputs(id: number, inputDict: { [id: string]: number[]; }) {
        await this.eventWrapper(async () => {
            const session = this.dataService.get(id);

            const sessionPlugin = this.dataService.reference<any>(id);

            session.inputDict = inputDict;
            
            if (sessionPlugin.getOptions().noMore()) {
                await this.sessionFinishWrapper(session, sessionPlugin);
            } else {
                session.optionList = sessionPlugin.getOptions().options();
                session.state = SessionState.Setup;
                session.isWaiting = false;
                this.dataService.update(session);
                this.producer.send(this.eventUpdate, session); 
            }
        });
    }

    async options(id: number, inputs: { [id: string]: any; }) {
        await this.eventWrapper(async () => {
            const session = this.dataService.get(id);
            const sessionPlugin = this.dataService.reference<any>(id);

            sessionPlugin.getOptions().submit(inputs);            

            if (sessionPlugin.getOptions().noMore()) {
                
                await this.sessionFinishWrapper(session, sessionPlugin);

            } else {
                session.optionList = sessionPlugin.getOptions().options();
                session.state = SessionState.Setup;
                session.isWaiting = false;
                this.dataService.update(session);
                this.producer.send(this.eventUpdate, session);
            }
        });
    }

    async previous(id: number) {
        await this.eventWrapper(async () => {
            const session = this.dataService.get(id);

            if (session.state === SessionState.Select) {
                this.dataService.delete(id);
                this.producer.send(this.eventFinish, id, session.returnPath);
            } else if (session.state === SessionState.Input) {
                await this.deactivatePlugin(session.plugin);
                session.state = SessionState.Select;
                session.inputDict = undefined;
                session.isWaiting = false;
                session.plugin = undefined;
                this.dataService.update(session);
                this.producer.send(this.eventUpdate, session);
            } else if (session.state === SessionState.Setup) {
                session.optionList = undefined;
                if (session.plugin.hasOwnProperty('inputs')) {
                    session.state = SessionState.Input;
                } else {
                    await this.deactivatePlugin(session.plugin);
                    session.state = SessionState.Select;
                    session.plugin = undefined;
                }
                session.isWaiting = false;
                this.dataService.update(session);
                this.producer.send(this.eventUpdate, session);
            } else {
                throw {
                    header: 'Session Error',
                    description: `session ${id} is in invalid state`,
                    type: ErrorTypes.Error
                };
            }
        });
    }

    async deactivatePlugin(plugin: Plugin) {
        await this.context.deactivate(this.packageService.find(plugin), plugin);
    }

    private async eventWrapper(func: () => Promise<void>) {
        try {
            await func();
        } catch (error) {
            this.producer.send(ErrorEvent, error);
        }
    }

    private async sessionFinishWrapper(session: Session, plugin: any) {
        await this.sessionFinish(session, plugin);
        await this.deactivatePlugin(session.plugin);
        this.dataService.delete(session.id);
        this.producer.send(this.eventFinish, session.id);
    } 



}

