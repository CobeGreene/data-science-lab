import { Subject } from 'rxjs';
import { SelectTransformPlugin } from '../../../../shared/models';

export abstract class TransformPluginsService {
    
    public transformPluginsChanged: Subject<SelectTransformPlugin[]>;

    constructor() {
        this.transformPluginsChanged = new Subject<SelectTransformPlugin[]>();
    }

    abstract all(): SelectTransformPlugin[];
}

