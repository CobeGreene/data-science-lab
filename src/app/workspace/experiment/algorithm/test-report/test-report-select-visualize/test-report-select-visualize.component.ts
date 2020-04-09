import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionPlugin, Session, TestReport } from '../../../../../../../shared/models';
import { TestReportVisualSessionService } from '../../../../../session-services/test-report-visual-session-service';
import { RouterService } from '../../../../../services/router-service';
import { SessionPluginService } from '../../../../../services/session-plugin-service';
import { TestReportService } from '../../../../../services/test-report-service';
import { PluginTypes } from 'data-science-lab-core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-test-report-select-visualize',
  templateUrl: './test-report-select-visualize.component.html'
})
export class TestReportSelectVisualizeComponent implements OnInit, OnDestroy {

  plugins: SessionPlugin[];
  session: Session;
  report: TestReport;

  constructor(
    private routerService: RouterService,
    private sessionService: TestReportVisualSessionService,
    private sessionPluginService: SessionPluginService,
    private testReportService: TestReportService
  ) { }

  ngOnInit() {
    const id = this.routerService.data().sessionId;
    this.session = this.sessionService.get(id);
    this.report = this.testReportService.get(this.session.keyId);

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
        this.report = this.testReportService.get(this.session.keyId);
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
      this.report.features.filter((_, index) => this.session.selectedFeatures.indexOf(index) >= 0));
  }

}
