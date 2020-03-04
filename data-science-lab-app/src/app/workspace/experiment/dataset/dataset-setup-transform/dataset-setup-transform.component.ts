import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransformSessionService } from '../../../../session-services/transform-session-service';
import { RouterService } from '../../../../services/router-service';
import { Session } from '../../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-dataset-setup-transform',
  templateUrl: './dataset-setup-transform.component.html'
})
export class DatasetSetupTransformComponent implements OnInit, OnDestroy {
  session: Session;
  values: { [id: string]: any } = {};

  constructor(
    private sessionService: TransformSessionService,
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
