import { Subject } from 'rxjs';
import { Area } from '../../models';

export abstract class CoreAreaService {

    sizeChanged: Subject<void>;
    sidebarChanged: Subject<boolean>;

    constructor() {
        this.sizeChanged = new Subject<void>();
        this.sidebarChanged = new Subject<boolean>();
    }

    abstract registerWorkspace(element: HTMLElement);

    abstract getWorkspace(): Area;

    abstract resizeEvent();

    abstract sidebarExpanded(expanded: boolean);

    abstract isSidebarExpanded(): boolean;
}
