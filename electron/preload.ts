import { ipcRenderer } from 'electron';
import { Listener } from '../shared/services';

console.log('preload.js loaded');

window.electronIpcSend = (channel: string, ...arg: any) => {
    ipcRenderer.send(channel, ...arg);
};

window.electronIpcOn = (channel: string, listener: Listener) => {
    ipcRenderer.on(channel, listener);
};

window.electronIpcOnce = (channel: string, listener: Listener) => {
    ipcRenderer.once(channel, listener);
};

window.electronIpcRemoveListener = (channel: string, listener: Listener) => {
    ipcRenderer.removeListener(channel, listener);
};

window.electronIpcRemoveAllListeners = (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
};

