import { Component, OnInit, ViewContainerRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { NgForm } from '@angular/forms';
import { OverlayService } from '../../../services/overlay-service';
import { DatasetService } from '../../../services/dataset-service';
import { Dataset } from '../../../../../shared/models';

@Component({
  selector: 'app-edit-dataset',
  templateUrl: './edit-dataset.component.html'
})
export class EditDatasetComponent extends ModalComponent implements OnInit, OnDestroy {

  @Input() id: number;
  datasetName: string;

  @ViewChild('updateForm', { static: false }) updateForm: NgForm;

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
    private datasetService: DatasetService) {
    super(overlay, viewContainerRef, overlayService);
  }

  onOpen() {
    this.datasetName = this.datasetService.get(this.id).name;
  }
  
  ngOnInit() {
    this.datasetName = this.datasetService.get(this.id).name;
  }

  ngOnDestroy() {

  }

  onSubmit(_: Event) {
    this.datasetService.rename(this.id, this.datasetName);
    this.overlayService.close();
  }

  onCancel() {
    this.overlayService.close();
  }

}
