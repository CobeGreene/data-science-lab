import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';

@Component({
  selector: 'app-create-experiment',
  templateUrl: './create-experiment.component.html',
  styleUrls: ['./create-experiment.component.css']
})
export class CreateExperimentComponent extends ModalComponent implements OnInit, OnDestroy {

  model: any = {};

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService) {
      super(overlay, viewContainerRef, overlayService);
  }

  ngOnInit() {

  }

  onOpen() {
    this.model = {};
  }

  ngOnDestroy() {

  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.overlayService.close();
  }



}
