import { Subject } from 'rxjs';
import { SelectTransformPlugin } from '../../../../shared/models';

export abstract class TransformPluginsService {
    
    public transformPluginsChanged: Subject<SelectTransformPlugin[]>;
    public transformPluginSelected: Subject<{dataGroupId: number, plugin: SelectTransformPlugin}>;

    constructor() {
        this.transformPluginsChanged = new Subject<SelectTransformPlugin[]>();
        this.transformPluginSelected = new Subject<{dataGroupId: number, plugin: SelectTransformPlugin}>();
    }

    abstract all(): SelectTransformPlugin[];

    abstract get(dataGroupId: number): SelectTransformPlugin;

    abstract select(dataGroupId: number, plugin: SelectTransformPlugin): void;
}

