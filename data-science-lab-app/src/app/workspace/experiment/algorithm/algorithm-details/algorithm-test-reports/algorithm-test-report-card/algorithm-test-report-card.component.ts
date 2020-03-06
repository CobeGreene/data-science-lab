import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TestReport } from '../../../../../../../../shared/models';
import { DropdownComponent } from '../../../../../../shared/dropdown/dropdown.component';
import { RouterService } from '../../../../../../services/router-service';
import { TestReportService } from '../../../../../../services/test-report-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-algorithm-test-report-card',
  templateUrl: './algorithm-test-report-card.component.html',
  styleUrls: ['./algorithm-test-report-card.component.css']
})
export class AlgorithmTestReportCardComponent implements OnInit, OnDestroy {

  @Input() id: number;
  report: TestReport;

  @ViewChild('optionsCmp', { static: false }) optionsComponent: ElementRef;
  @ViewChild('optionsDropdown', { static: false }) optionsDropdown: DropdownComponent;

  constructor(
    private routerService: RouterService,
    private testReportService: TestReportService
  ) { }

  ngOnInit() {
    this.report = this.testReportService.get(this.id);

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.report = this.testReportService.get(this.id);
      });

    this.testReportService.testReportUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.id) {
          this.report = value;
        }
      });
  }

  ngOnDestroy() {

  }

  onOptions(event: MouseEvent) {
    this.optionsDropdown.open(event, this.optionsComponent);
  }

}
