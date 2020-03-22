import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';
import { ExperimentService } from '../../../services/experiment-service/experiment.service';

@Component({
  selector: 'app-create-experiment',
  templateUrl: './create-experiment.component.html',
  styleUrls: ['./create-experiment.component.css']
})
export class CreateExperimentComponent extends ModalComponent implements OnInit, OnDestroy {

  model: any = {};

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, 
    overlayService: OverlayService, private experimentService: ExperimentService) {
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
    this.experimentService.create(this.model.title, this.model.description);
    this.overlayService.close();
  }



}
