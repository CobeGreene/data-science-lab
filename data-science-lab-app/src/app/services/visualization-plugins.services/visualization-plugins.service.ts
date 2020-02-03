import { Subject } from 'rxjs';
import { VisualizationPluginViewModel } from '../../../../shared/view-models';

export abstract class VisualizationPluginsService {
    public visualizationPluginsChanged: Subject<VisualizationPluginViewModel[]>;
    public visualizationPluginDataGroupSelected: Subject<{ dataGroupId: number, plugin: VisualizationPluginViewModel }>;
    public visualizationPluginAlgorithmSelected: Subject<{ algorithmId: number, plugin: VisualizationPluginViewModel }>;

    constructor() {
        this.visualizationPluginsChanged = new Subject<VisualizationPluginViewModel[]>();
        this.visualizationPluginDataGroupSelected = new Subject<{ dataGroupId: number, plugin: VisualizationPluginViewModel }>();
        this.visualizationPluginAlgorithmSelected = new Subject<{ algorithmId: number, plugin: VisualizationPluginViewModel }>();
    }


    abstract all(): VisualizationPluginViewModel[];

    abstract getDataGroup(dataGroupId: number): VisualizationPluginViewModel;

    abstract getAlgorithm(algorithmId: number): VisualizationPluginViewModel;

    abstract selectDataGroup(dataGroupId: number, plugin: VisualizationPluginViewModel): void;
    
    abstract selectAlgorithm(algorithmId: number, plugin: VisualizationPluginViewModel): void;

    abstract deselectDataGroup(dataGroupId: number): void;
    
    abstract deselectAlgorithm(algorithmId: number): void;
}
