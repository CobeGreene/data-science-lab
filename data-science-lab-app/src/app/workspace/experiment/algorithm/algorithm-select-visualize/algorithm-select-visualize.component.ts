import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionPlugin, Session, AlgorithmTracker, TrackerVariable } from '../../../../../../shared/models';
import { PluginTypes } from 'data-science-lab-core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { RouterService } from '../../../../services/router-service';
import { SessionPluginService } from '../../../../services/session-plugin-service';
import { TrackerService } from '../../../../services/tracker-service';
import { AlgorithmVisualSessionService } from '../../../../session-services/algorithm-visual-session-service';

@Component({
  selector: 'app-algorithm-select-visualize',
  templateUrl: './algorithm-select-visualize.component.html'
})
export class AlgorithmSelectVisualizeComponent implements OnInit, OnDestroy {
  
  plugins: SessionPlugin[];
  session: Session;
  tracker: AlgorithmTracker;
  features: TrackerVariable[];

  constructor(
    private routerService: RouterService,
    private sessionService: AlgorithmVisualSessionService,
    private sessionPluginService: SessionPluginService,
    private trackerService: TrackerService
  ) { }

  ngOnInit() {
    const id = this.routerService.data().sessionId;
    this.session = this.sessionService.get(id);
    this.tracker = this.trackerService.get(this.session.keyId);
    this.features = [].concat({
      name: 'Iteration',
      type: 'number'
    } ,...this.tracker.variables);

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
        this.tracker = this.trackerService.get(this.session.keyId);
        this.features = [].concat({
          name: 'Iteration',
          type: 'number'
        } ,...this.tracker.variables);
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
    const features = this.tracker.variables.filter((_, index) => this.session.selectedFeatures.indexOf(index - 1) >= 0);
    if (this.session.selectedFeatures.indexOf(0) >= 0) {
      features.push({
        name: 'Iteration',
        type: 'number'
      });
    } 
    this.plugins = this.sessionPluginService.compatible(PluginTypes.Visualization, features);
  }

}
