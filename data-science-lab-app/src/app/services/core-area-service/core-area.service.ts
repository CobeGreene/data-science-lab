import { Subject } from 'rxjs';
import { Area } from '../../models';

export abstract class CoreAreaService {

    sizeChanged: Subject<void>;

    constructor() {
        this.sizeChanged = new Subject<void>();
    }

    abstract registerWorkspace(element: HTMLElement);

    abstract getWorkspace(): Area;

    abstract resizeEvent();
}
