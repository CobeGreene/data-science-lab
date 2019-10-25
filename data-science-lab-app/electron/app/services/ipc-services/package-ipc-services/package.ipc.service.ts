import { BaseIpcService } from '../base-ipc-service';

export abstract class PackageIpcService implements BaseIpcService {
    abstract initialize(): void;
    abstract destory(): void;
}
