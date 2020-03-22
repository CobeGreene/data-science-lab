import { Component, OnInit, Input, ViewContainerRef, ViewChild } from '@angular/core';
import { Algorithm } from '../../../../../shared/models';
import { AlgorithmService } from '../../../services/algorithm-service';
import { ModalComponent } from '../../modal/modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-edit-algorithm',
  templateUrl: './edit-algorithm.component.html'
})
export class EditAlgorithmComponent extends ModalComponent implements OnInit {

  @Input() id: number;

  algorithm: Algorithm;

  @ViewChild('editForm', { static: false }) editForm: NgForm;


  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
    private algorithmService: AlgorithmService) {
    super(overlay, viewContainerRef, overlayService);
  }

  onOpen() {
    this.algorithm = {...this.algorithmService.get(this.id)};
  }

  ngOnInit() {
    this.algorithm = {...this.algorithmService.get(this.id)};
  }

  onSubmit(_: Event) {
    if (this.algorithm.iterationTime >= 1 && this.algorithm.iterationTime < 10000) {
      this.algorithmService.update(this.id, this.algorithm.name, this.algorithm.iterationTime);
      this.overlayService.close();
    }
  }

  onCancel() {
    this.overlayService.close();
  }

}
