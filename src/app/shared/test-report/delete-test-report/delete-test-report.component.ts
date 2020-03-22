import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { TestReport } from '../../../../../shared/models';
import { TestReportService } from '../../../services/test-report-service';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';

@Component({
  selector: 'app-delete-test-report',
  templateUrl: './delete-test-report.component.html'
})
export class DeleteTestReportComponent extends ModalComponent implements OnInit {

  @Input() id: number;
  report: TestReport;

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
    private reportService: TestReportService) {
    super(overlay, viewContainerRef, overlayService);
  }

  ngOnInit() {
    this.report = this.reportService.get(this.id);  
  }
  
  onOpen() {
    this.report = this.reportService.get(this.id);  
  }

  onYes(event: Event) {
    event.preventDefault();
    this.reportService.delete(this.id);
    this.overlayService.close();
  }
  
  onNo(event: Event) {
    event.preventDefault();
    this.overlayService.close();
  }


}
