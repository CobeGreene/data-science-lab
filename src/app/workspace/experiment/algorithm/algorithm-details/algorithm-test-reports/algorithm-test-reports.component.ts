import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { TestReport } from '../../../../../../../shared/models';
import { TestReportService } from '../../../../../services/test-report-service';
import { RouterService } from '../../../../../services/router-service';
import { TestReportSessionService } from '../../../../../session-services/test-report-session-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { CoreAreaService } from '../../../../../services/core-area-service/core-area.service';

@Component({
  selector: 'app-algorithm-test-reports',
  templateUrl: './algorithm-test-reports.component.html',
  styleUrls: ['./algorithm-test-reports.component.css']
})
export class AlgorithmTestReportsComponent implements OnInit, OnDestroy {

  id: number;
  reports: TestReport[];
  @HostBinding('class.sidebar-expanded') sidebarExpanded: boolean;

  constructor(
    private routerService: RouterService,
    private testReportService: TestReportService,
    private coreAreaService: CoreAreaService,
    private testReportSessionService: TestReportSessionService,
  ) { }

  ngOnInit() {

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.id = this.routerService.data().algorithmId;
        this.reports = this.testReportService.all(this.id);
      });

    this.testReportService.testReportsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((_) => {
        this.reports = this.testReportService.all(this.id);
      });


    this.coreAreaService.sidebarChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.sidebarExpanded = value;
      });
    this.sidebarExpanded = this.coreAreaService.isSidebarExpanded();
    
    this.id = this.routerService.data().algorithmId;
    this.reports = this.testReportService.all(this.id);

  }

  ngOnDestroy() {

  }

  onCreate() {
    this.testReportSessionService.create(this.id, {
      currentRoute: this.routerService.current(),
      newTab: true
    }, this.routerService.current());
  }

}
