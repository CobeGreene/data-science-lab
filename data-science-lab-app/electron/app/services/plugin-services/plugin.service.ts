import { AppService } from '../app-services/app-service';

export abstract class PluginService implements AppService {
    abstract inititalize(): void;
    abstract destory(): void;
}
