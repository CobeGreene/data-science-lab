import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';
import { DatasetService } from '../../../services/dataset-service';
import { Dataset } from '../../../../../shared/models';

@Component({
  selector: 'app-split-dataset',
  templateUrl: './split-dataset.component.html',
  styleUrls: ['./split-dataset.component.css']
})
export class SplitDatasetComponent extends ModalComponent implements OnInit {

  @Input() id: number;

  dataset: Dataset;

  value: number;

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, 
    overlayService: OverlayService, private datasetService: DatasetService) {
    super(overlay, viewContainerRef, overlayService);
  }

  ngOnInit() {
    this.dataset = this.datasetService.get(this.id);
    this.onSelect(0.5);
  }
  
  onOpen() {
    this.dataset = this.datasetService.get(this.id);
    this.onSelect(0.5);
  }

  onClose() {
  }

  onSelect(percent: number) {
    this.value = Math.ceil(this.dataset.examples * percent);
  }

  onSplit(_: Event) {
    this.datasetService.split(this.id, this.value);
    this.overlayService.close();
  }

}
