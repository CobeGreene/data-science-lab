import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dataset, Feature, Session, SessionPlugin } from '../../../../../../shared/models';
import { RouterService } from '../../../../services/router-service';
import { DatasetService } from '../../../../services/dataset-service';
import { DatasetVisualSessionService } from '../../../../session-services/dataset-visual-session-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-dataset-inputs-visualize',
  templateUrl: './dataset-inputs-visualize.component.html',
})
export class DatasetInputsVisualizeComponent implements OnInit, OnDestroy {

  id: number;
  dataset: Dataset;
  features: Feature[];
  session: Session;
  plugin: SessionPlugin;

  constructor(
    private routerService: RouterService,
    private datasetService: DatasetService,
    private sessionService: DatasetVisualSessionService,
  ) { }

  ngOnInit() {
    this.id = this.routerService.data().sessionId;
    this.session = this.sessionService.get(this.id);
    this.plugin = this.session.plugin as SessionPlugin;
    this.dataset = this.datasetService.get(this.session.keyId);
    this.features = this.session.selectedFeatures.map(value => this.dataset.features[value]);

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.id = this.routerService.data().sessionId;
        this.session = this.sessionService.get(this.id);
        this.plugin = this.session.plugin as SessionPlugin;
        this.dataset = this.datasetService.get(this.session.keyId);
        this.features = this.session.selectedFeatures.map(value => this.dataset.features[value]);
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
