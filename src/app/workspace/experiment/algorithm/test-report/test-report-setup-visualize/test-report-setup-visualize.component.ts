import { Component, OnInit, OnDestroy } from '@angular/core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Session } from '../../../../../../../shared/models';
import { TestReportVisualSessionService } from '../../../../../session-services/test-report-visual-session-service';
import { RouterService } from '../../../../../services/router-service';

@Component({
  selector: 'app-test-report-setup-visualize',
  templateUrl: './test-report-setup-visualize.component.html'
})
export class TestReportSetupVisualizeComponent implements OnInit, OnDestroy {

  session: Session;
  values: { [id: string]: any } = {};

  constructor(
    private sessionService: TestReportVisualSessionService,
    private routerService: RouterService
  ) { }


  ngOnInit() {

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.session = this.sessionService.get(this.routerService.data().sessionId);
        this.values = this.session.inputValues || {};
      });

    this.session = this.sessionService.get(this.routerService.data().sessionId);
    this.values = this.session.inputValues || {};
  }

  ngOnDestroy() {

  }

  onSubmit(event: { [id: string]: any }): void {
    this.session.inputValues = {};
    this.sessionService.inputOptions(this.session.id, event);
  }

  onCommand(event: string): void {
    this.session.inputValues = {};
    this.sessionService.executeCommand(this.session.id, event);
  }

  onReturn(): void {
    this.sessionService.previous(this.session.id);
  }

  onQuit() {
    this.sessionService.delete(this.session.id);
  }

  onValues(event: { [id: string]: any }): void {
    this.values = event;
    this.session.inputValues = event;
  }

}
