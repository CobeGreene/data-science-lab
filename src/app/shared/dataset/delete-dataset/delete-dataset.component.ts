import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { Dataset } from '../../../../../shared/models';
import { ModalComponent } from '../../modal/modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';
import { DatasetService } from '../../../services/dataset-service/dataset.service';


@Component({
  selector: 'app-delete-dataset',
  templateUrl: './delete-dataset.component.html',
})
export class DeleteDatasetComponent extends ModalComponent implements OnInit {

  @Input() id: number;
  dataset: Dataset;

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
    private datasetService: DatasetService) {
    super(overlay, viewContainerRef, overlayService);
  }

  ngOnInit() {
    this.dataset = this.datasetService.get(this.id);
  }

  onOpen() {
    this.dataset = this.datasetService.get(this.id);
  }

  onYes(_: Event) {
    this.datasetService.delete(this.id);
    this.overlayService.close();
  }

  onNo(_: Event) {
    this.overlayService.close();
  }

}
