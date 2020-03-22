import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterService } from '../../../../services/router-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DatasetService } from '../../../../services/dataset-service';
import { TestReportSessionService } from '../../../../session-services/test-report-session-service';
import { Dataset } from '../../../../../../shared/models';

@Component({
  selector: 'app-algorithm-select-test',
  templateUrl: './algorithm-select-test.component.html'
})
export class AlgorithmSelectTestComponent implements OnInit, OnDestroy {

  id: number;
  sessionId: number;
  datasets: Dataset[];

  constructor(
    private routerService: RouterService,
    private datasetService: DatasetService,
    private testReportSessionService: TestReportSessionService
  ) { }

  ngOnInit() {
    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((_) => {
        this.id = this.routerService.data().id;
        this.sessionId = this.routerService.data().sessionId;
        this.datasets = this.datasetService.all(this.id);
      });

    this.datasetService.datasetsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.datasets = this.datasetService.all(this.id);
      });


    this.id = this.routerService.data().id;
    this.sessionId = this.routerService.data().sessionId;
    this.datasets = this.datasetService.all(this.id);
  }

  ngOnDestroy() {

  }

  onExit() {
    this.testReportSessionService.delete(this.sessionId);
  }

  onReturn() {
    this.testReportSessionService.previous(this.sessionId);
  }

  onSelect(event: Dataset) {
    this.testReportSessionService.select(this.sessionId, event.id,
      event.features.map((_, index) => index));
  }

}
