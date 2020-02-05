import { Subject } from 'rxjs';
import { TransformPluginViewModel } from '../../../../shared/view-models';

export abstract class TransformPluginsService {

    public transformPluginsChanged: Subject<TransformPluginViewModel[]>;
    public transformPluginSelected: Subject<{ dataGroupId: number, plugin: TransformPluginViewModel }>;

    constructor() {
        this.transformPluginsChanged = new Subject<TransformPluginViewModel[]>();
        this.transformPluginSelected = new Subject<{ dataGroupId: number, plugin: TransformPluginViewModel }>();
    }

    abstract all(): TransformPluginViewModel[];

    abstract get(dataGroupId: number): TransformPluginViewModel;

    abstract select(dataGroupId: number, plugin: TransformPluginViewModel): void;

    abstract deselect(dataGroupId: number): void;
}

