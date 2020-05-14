import { Component, OnInit, OnDestroy } from '@angular/core';
import { Feature, Session, TestReport, TestReportSession, SessionPlugin } from '../../../../../../../shared/models';
import { RouterService } from '../../../../../services/router-service';
import { TestReportService } from '../../../../../services/test-report-service';
import { TestReportVisualSessionService } from '../../../../../session-services/test-report-visual-session-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-test-report-inputs-visualize',
  templateUrl: './test-report-inputs-visualize.component.html'
})
export class TestReportInputsVisualizeComponent implements OnInit, OnDestroy {

  id: number;
  report: TestReport;
  features: Feature[];
  session: Session;
  plugin: SessionPlugin;

  constructor(
    private routerService: RouterService,
    private reportService: TestReportService,
    private sessionService: TestReportVisualSessionService
  ) { }

  ngOnInit() {
    this.id = this.routerService.data().sessionId;
    this.session = this.sessionService.get(this.id);
    this.plugin = this.session.plugin as SessionPlugin;
    this.report = this.reportService.get(this.session.keyId);
    this.features = this.session.selectedFeatures.map(value => this.report.features[value]);

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.id = this.routerService.data().sessionId;
        this.session = this.sessionService.get(this.id);
        this.plugin = this.session.plugin as SessionPlugin;
        this.report = this.reportService.get(this.session.keyId);
        this.features = this.session.selectedFeatures.map(value => this.report.features[value]);
      });
  }

  ngOnDestroy() {

  }

  onValues(event: { [id: string]: number[] }) {
    this.session.inputDict = event;
  }

  onQuit() {
    this.session = this.sessionService.get(this.id);
    if (!this.session.isWaiting) {
      this.sessionService.delete(this.id);
    }
  }

  onReturn() {
    this.session = this.sessionService.get(this.id);
    if (!this.session.isWaiting) {
      this.sessionService.previous(this.id);
    }
  }

  onSubmit(dict: { [id: string]: number[] }) {
    this.session = this.sessionService.get(this.id);
    if (!this.session.isWaiting) {
      this.sessionService.inputDictionary(this.id, dict);
    }
  }

}
