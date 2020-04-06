import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, HostBinding, HostListener } from '@angular/core';
import { TestReport, Dataset } from '../../../../../../../../shared/models';
import { DropdownComponent } from '../../../../../../shared/dropdown/dropdown.component';
import { RouterService } from '../../../../../../services/router-service';
import { TestReportService } from '../../../../../../services/test-report-service';
import { DatasetService } from '../../../../../../services/dataset-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { EditTestReportComponent } from '../../../../../../shared/test-report/edit-test-report/edit-test-report.component';
import { DeleteTestReportComponent } from '../../../../../../shared/test-report/delete-test-report/delete-test-report.component';

@Component({
  selector: 'app-algorithm-test-report-card',
  templateUrl: './algorithm-test-report-card.component.html',
  styleUrls: ['./algorithm-test-report-card.component.css']
})
export class AlgorithmTestReportCardComponent implements OnInit, OnDestroy {

  @Input() id: number;
  report: TestReport;
  dataset?: Dataset;
  


  @ViewChild('optionsCmp', { static: false }) optionsComponent: ElementRef;
  @ViewChild('optionsDropdown', { static: false }) optionsDropdown: DropdownComponent;

  @ViewChild('editCmp', { static: false}) editComponent: EditTestReportComponent;
  @ViewChild('deleteCmp', { static: false }) deleteComponent: DeleteTestReportComponent;

  @HostBinding('class.expanded') expanded: boolean = false;

  @HostListener('click', ['$event']) onClick(_: MouseEvent) {
    this.expanded = !this.expanded; 
  }

  constructor(
    private routerService: RouterService,
    private testReportService: TestReportService,
    private datasetService: DatasetService
  ) { }

  ngOnInit() {
    this.report = this.testReportService.get(this.id);
    this.dataset = this.datasetService.exists(this.report.datasetId) ? this.datasetService.get(this.report.datasetId) : undefined;
    
    this.routerService.changed()
    .pipe(untilComponentDestroyed(this))
    .subscribe(() => {
      this.report = this.testReportService.get(this.id);
      this.dataset = this.datasetService.exists(this.report.datasetId) ? this.datasetService.get(this.report.datasetId) : undefined;
    });
    
    this.testReportService.testReportUpdated
    .pipe(untilComponentDestroyed(this))
    .subscribe((value) => {
      if (value.id === this.id) {
        this.report = value;
        this.dataset = this.datasetService.exists(this.report.datasetId) ? this.datasetService.get(this.report.datasetId) : undefined;
        }
      });
  }

  ngOnDestroy() {

  }

  onOptions(event: MouseEvent) {
    this.optionsDropdown.open(event, this.optionsComponent);
  }

  onEdit(event: MouseEvent) {
    this.editComponent.open(event);
  }

  onDelete(event: MouseEvent) {
    this.deleteComponent.open(event);
  }

}
