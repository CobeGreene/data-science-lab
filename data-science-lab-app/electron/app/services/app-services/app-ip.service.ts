import { IpService, Listener } from '../../../../shared/services';
import { ipcMain } from 'electron';
import { win } from '../../app';

export class AppIpService implements IpService {
    send(channel: string, ...arg: any[]): void {
        win.webContents.send(channel, arg);
    }    
    
    on(channel: string, listener: Listener): void {
        ipcMain.on(channel, listener);
    }
    once(channel: string, listener: Listener): void {
        ipcMain.once(channel, listener);
    }
    removeListener(channel: string, listener: Listener): void {
        ipcMain.removeListener(channel, listener);
    }
    removeAllListeners(channel: string): void {
        ipcMain.removeAllListeners(channel);
    }
}
