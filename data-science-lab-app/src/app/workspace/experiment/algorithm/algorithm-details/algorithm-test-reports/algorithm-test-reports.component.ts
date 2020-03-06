import { Component, OnInit, OnDestroy } from '@angular/core';
import { TestReport } from '../../../../../../../shared/models';
import { TestReportService } from '../../../../../services/test-report-service';
import { RouterService } from '../../../../../services/router-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-algorithm-test-reports',
  templateUrl: './algorithm-test-reports.component.html',
  styleUrls: ['./algorithm-test-reports.component.css']
})
export class AlgorithmTestReportsComponent implements OnInit, OnDestroy {

  id: number;
  reports: TestReport[];

  constructor(
    private routerService: RouterService,
    private testReportService: TestReportService
  ) { }

  ngOnInit() {

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.id = this.routerService.data().algorithmId;
        this.reports = this.testReportService.all(this.id);
      });

    this.id = this.routerService.data().algorithmId;
    this.reports = this.testReportService.all(this.id);

    this.testReportService.testReportsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((_) => {
        this.reports = this.testReportService.all(this.id);
      });
  }

  ngOnDestroy() {

  }

}
