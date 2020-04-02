import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { ServiceModelRoutes, Producer, } from '../../pipeline';
import { VisualEvents, ExperimentEvents } from '../../../../shared/events';
import { ServiceModel } from '../service-model';
import { VisualDataService } from '../../data-services/visual-data-service';
import { BrowserDataService } from '../../data-services/browser-data-service';


export class VisualServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.VisualServiceModel,
        routes: [
            { path: VisualEvents.All, method: 'all' },
            { path: VisualEvents.Delete, method: 'delete' },
            { path: VisualEvents.Resize, method: 'resize' },
            { path: VisualEvents.Reposition, method: 'reposition' },
            { path: VisualEvents.Show, method: 'show' },
            { path: ExperimentEvents.Load, method: 'load' },
            { path: ExperimentEvents.Delete, method: 'deleteByExperiment', isListener: true },
            { path: ExperimentEvents.Save, method: 'save', isListener: true }
        ]
    }

    private dataService: VisualDataService;
    private browserService: BrowserDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.dataService = serviceContainer.resolve<VisualDataService>(SERVICE_TYPES.VisualDataService);
        this.browserService = serviceContainer.resolve<BrowserDataService>(SERVICE_TYPES.BrowserDataService);
    }

    all() {
        this.producer.send(VisualEvents.All, this.dataService.all());
    }

    delete(id: number) {
        this.dataService.delete(id);
        this.producer.send(VisualEvents.Delete, id);
    }

    load(experimentId: number) {
        this.dataService.load(experimentId);
        this.producer.send(VisualEvents.All, this.dataService.all());
    }

    save(experimentId: number) {
        this.dataService.save(experimentId);
    }

    resize(id: number, width: number, height: number) {
        const visual = this.dataService.get(id);
        visual.width = width;
        visual.height = height;
        this.dataService.update(visual);
        this.producer.send(VisualEvents.Update, visual);
    }

    reposition(id: number, top: number, left: number) {
        const visual = this.dataService.get(id);
        visual.top = top;
        visual.left = left;
        this.dataService.update(visual);
        this.producer.send(VisualEvents.Update, visual);
    }

    deleteByExperiment(experimentId: number) {
        const ids = this.dataService.deleteByExperiment(experimentId);
        ids.forEach(id => this.producer.send(VisualEvents.Delete, id));
    }

    async show(id: number) {
        const visual = this.dataService.get(id);
        await this.browserService.create(visual.srcdoc, visual.name);
    }
    
}

