import { Subject } from 'rxjs';
import { AlgorithmPluginViewModel } from '../../../../shared/view-models';


export abstract class AlgorithmPluginsService {

    public algorithmPluginsChanged: Subject<AlgorithmPluginViewModel[]>;
    public algorithmPluginSelected: Subject<{ dataGroupId: number, plugin: AlgorithmPluginViewModel}>;

    constructor() {
        this.algorithmPluginsChanged = new Subject<AlgorithmPluginViewModel[]>();
        this.algorithmPluginSelected = new Subject<{ dataGroupId: number, plugin: AlgorithmPluginViewModel}>();
    }

    abstract all(): AlgorithmPluginViewModel[];

    abstract get(dataGroupId: number): AlgorithmPluginViewModel;

    abstract select(dataGroupId: number, plugin: AlgorithmPluginViewModel): void;

    abstract deselect(dataGroupId: number): void;

}


