import { BrowserWindow } from "electron";

export interface BrowserDataService {
    create(srcodc: string, name: string): Promise<void>;
    delete(id: number);
}