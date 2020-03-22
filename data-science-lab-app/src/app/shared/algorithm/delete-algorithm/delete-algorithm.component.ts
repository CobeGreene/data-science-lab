import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { Algorithm } from '../../../../../shared/models';
import { AlgorithmService } from '../../../services/algorithm-service';
import { ModalComponent } from '../../modal/modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';


@Component({
  selector: 'app-delete-algorithm',
  templateUrl: './delete-algorithm.component.html'
})
export class DeleteAlgorithmComponent extends ModalComponent implements OnInit {

  @Input() id: number;
  algorithm: Algorithm;

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
    private algorithmService: AlgorithmService) {
    super(overlay, viewContainerRef, overlayService);
  }

  ngOnInit() {
    this.algorithm = this.algorithmService.get(this.id);
  }
  
  onOpen() {
    this.algorithm = this.algorithmService.get(this.id);
  }

  onYes(_: Event) {
    this.algorithmService.delete(this.id);
    this.overlayService.close();
  }

  onNo(_: Event) {
    this.overlayService.close();
  }

}
