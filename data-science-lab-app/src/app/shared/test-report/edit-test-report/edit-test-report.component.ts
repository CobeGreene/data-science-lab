import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { TestReport } from '../../../../../shared/models';
import { TestReportService } from '../../../services/test-report-service';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';

@Component({
  selector: 'app-edit-test-report',
  templateUrl: './edit-test-report.component.html',
})
export class EditTestReportComponent extends ModalComponent implements OnInit {

  @Input() id: number;

  report: TestReport;

  @ViewChild('editForm', { static: false }) editForm: NgForm;

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
    private testReportService: TestReportService) {
    super(overlay, viewContainerRef, overlayService);
  }

  ngOnInit() {
    this.report = Object.assign({}, this.testReportService.get(this.id));
  }

  onOpen() {
    this.report = Object.assign({}, this.testReportService.get(this.id));
  }

  onSubmit(_: Event) {
    this.testReportService.rename(this.id, this.report.name);
    this.overlayService.close();
  }
  
  onCancel() {
    this.overlayService.close();
  }

}
