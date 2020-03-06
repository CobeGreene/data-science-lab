import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterService } from '../../../../services/router-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DatasetService } from '../../../../services/dataset-service';
import { TestReportSessionService } from '../../../../session-services/test-report-session-service';
import { Dataset, TestReportSession, Feature } from '../../../../../../shared/models';

@Component({
  selector: 'app-algorithm-inputs-test',
  templateUrl: './algorithm-inputs-test.component.html',
})
export class AlgorithmInputsTestComponent implements OnInit, OnDestroy {

  id: number;
  dataset: Dataset;
  features: Feature[];
  session: TestReportSession;

  constructor(
    private routerService: RouterService,
    private datasetService: DatasetService,
    private sessionService: TestReportSessionService
  ) { }

  ngOnInit() {
    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((_) => {
        this.id = this.routerService.data().sessionId;
        this.session = this.sessionService.get(this.id);
        this.dataset = this.datasetService.get(this.session.datasetId);
        this.features = this.session.selectedFeatures.map(value => this.dataset.features[value]);
      });


    this.id = this.routerService.data().sessionId;
    this.session = this.sessionService.get(this.id);
    this.dataset = this.datasetService.get(this.session.datasetId);
    this.features = this.session.selectedFeatures.map(value => this.dataset.features[value]);

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
