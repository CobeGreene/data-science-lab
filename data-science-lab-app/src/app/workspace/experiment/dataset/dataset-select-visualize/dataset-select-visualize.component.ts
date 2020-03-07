import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionPlugin, Session, Dataset } from '../../../../../../shared/models';
import { RouterService } from '../../../../services/router-service';
import { SessionPluginService } from '../../../../services/session-plugin-service';
import { DatasetService } from '../../../../services/dataset-service';
import { DatasetVisualSessionService } from '../../../../session-services/dataset-visual-session-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { PluginTypes } from 'data-science-lab-core';

@Component({
  selector: 'app-dataset-select-visualize',
  templateUrl: './dataset-select-visualize.component.html'
})
export class DatasetSelectVisualizeComponent implements OnInit, OnDestroy {

  plugins: SessionPlugin[];
  session: Session;
  dataset: Dataset;

  constructor(
    private routerService: RouterService,
    private sessionService: DatasetVisualSessionService,
    private sessionPluginService: SessionPluginService,
    private datasetService: DatasetService
  ) { }

  ngOnInit() {
    const id = this.routerService.data().sessionId;
    this.session = this.sessionService.get(id);
    this.dataset = this.datasetService.get(this.session.keyId);


    this.sessionPluginService.pluginsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.initPlugins();
      });

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        const sessionId = this.routerService.data().sessionId;
        this.session = this.sessionService.get(sessionId);
        this.dataset = this.datasetService.get(this.session.keyId);
        this.initPlugins();
      });

    this.initPlugins();
  }

  ngOnDestroy() {

  }

  onValues(selected: number[]) {
    this.session.selectedFeatures = selected;
    this.initPlugins();
  }

  onReturn() {
    this.sessionService.previous(this.session.id);
  }

  onExit() {
    this.sessionService.delete(this.session.id);
  }

  onPlugin(plugin: SessionPlugin) {
    this.sessionService.select(this.session.id, plugin, this.session.selectedFeatures);
  }

  initPlugins() {
    this.plugins = this.sessionPluginService.compatible(PluginTypes.Visualization,
      this.dataset.features.filter((_, index) => this.session.selectedFeatures.indexOf(index) >= 0));
  }


}
