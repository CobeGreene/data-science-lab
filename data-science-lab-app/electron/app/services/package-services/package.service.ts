import { AppService } from '../app-services/app.service';

export abstract class PackageService implements AppService {
    abstract inititalize(): void;
    abstract destory(): void;
}
