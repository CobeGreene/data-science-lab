import { IpcService } from '../../../../../shared/services';
import { injectable, inject } from 'inversify';
import { IPC_SERVICE_TYPES } from '../../services-container';
import { PackageIpcService } from './package.ipc.service';

@injectable()
export class AppPackageIpcService implements PackageIpcService {
    private ipcService: IpcService;

    constructor(@inject(IPC_SERVICE_TYPES.IpcService) ipcService: IpcService) {
        this.ipcService = ipcService;
    }

    public initialize() {
        throw new Error("Method not implemented.");
    }
    public destory() {
        throw new Error("Method not implemented.");
    }


}
