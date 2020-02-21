import { CoreAreaService } from './core-area.service';
import { Area } from '../../models';

export class AppCoreAreaService extends CoreAreaService {

    workspace: HTMLElement;

    constructor() {
        super();
    }

    registerWorkspace(element: HTMLElement) {
        this.workspace = element;
    }
    
    getWorkspace(): Area {
        return {
            top: this.workspace.offsetTop,
            left: this.workspace.offsetLeft,
            width: this.workspace.offsetWidth,
            height: this.workspace.offsetHeight
        };
    }

    resizeEvent() {
        this.sizeChanged.next();
    }
}
