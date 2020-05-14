import { Service, ServiceContainer } from "../../service-container";
import { BrowserDataService } from "./browser.data-service";
import { BrowserWindow, Menu } from "electron";
import { IdGenerator } from "../../data-structures";
import * as fs from 'fs';
import * as path from 'path';

export class AppBrowserDataService extends Service implements BrowserDataService {
    private windows: { [id: number]: BrowserWindow };
    private idGenerator: IdGenerator;
    private readonly template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
        {
            label: 'View',
            submenu: [
                { role: 'toggleDevTools' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { role: 'togglefullscreen' }
            ]
        }
    ];

    constructor(serviceContainer: ServiceContainer) {
        super(serviceContainer);

        this.windows = {};
        this.idGenerator = new IdGenerator();
    }

    async create(srcdoc: string, name: string) {
        const file = path.join(__dirname, 'file.html');
        fs.writeFileSync(file, srcdoc);
        try {
            const window = new BrowserWindow({
               title:  name
            });
            const id = this.idGenerator.next();
            this.windows[id] = window;

            window.on('closed', () => {
                this.delete(id);
            });

            window.setMenu(Menu.buildFromTemplate(this.template));
            await window.loadFile(file);
        } catch (exception) {
        }
        fs.unlinkSync(file);
    }

    delete(id: number) {
        delete this.windows[id];
        this.windows[id] = undefined;
    }
}