import { IpcService, Listener } from '../../../shared/services';
import { ipcMain, ipcRenderer } from 'electron';
import { win } from '../app';

export class AppIpcService implements IpcService {

    constructor() {
        
    }

    send(channel: string, ...arg: any): void {
        win.webContents.send(channel, ...arg);
        ipcMain.emit(channel, channel, ...arg);
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
