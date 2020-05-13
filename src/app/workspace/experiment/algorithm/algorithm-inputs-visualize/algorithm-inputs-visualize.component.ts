import { Component, OnInit, OnDestroy } from '@angular/core';
import { Session, AlgorithmTracker, TrackerVariable, SessionPlugin } from '../../../../../../shared/models';
import { RouterService } from '../../../../services/router-service';
import { TrackerService } from '../../../../services/tracker-service';
import { AlgorithmVisualSessionService } from '../../../../session-services/algorithm-visual-session-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-algorithm-inputs-visualize',
  templateUrl: './algorithm-inputs-visualize.component.html',
})
export class AlgorithmInputsVisualizeComponent implements OnInit, OnDestroy {

  id: number;
  tracker: AlgorithmTracker;
  features: TrackerVariable[];
  session: Session;
  plugin: SessionPlugin;

  constructor(
    private routerService: RouterService,
    private sessionService: AlgorithmVisualSessionService,
    private trackerService: TrackerService
  ) { }

  ngOnInit() {
    this.id = this.routerService.data().sessionId;
    this.session = this.sessionService.get(this.id);
    this.plugin = this.session.plugin as SessionPlugin;

    this.tracker = this.trackerService.get(this.session.keyId);
    this.features = this.session.selectedFeatures.filter(value => value > 0).map(value => this.tracker.variables[value - 1]);
    if (this.session.selectedFeatures.indexOf(0) >= 0) {
      this.features.splice(0, 0, {
        name: 'Iteration',
        type: 'number'
      })
    }

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.id = this.routerService.data().sessionId;
        this.session = this.sessionService.get(this.id);
        this.plugin = this.session.plugin as SessionPlugin;
        this.tracker = this.trackerService.get(this.session.keyId);
        this.features = this.session.selectedFeatures.filter(value => value > 0).map(value => this.tracker.variables[value - 1]);
        if (this.session.selectedFeatures.indexOf(0) >= 0) {
          this.features.splice(0, 0, {
            name: 'Iteration',
            type: 'number'
          })
        }

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
