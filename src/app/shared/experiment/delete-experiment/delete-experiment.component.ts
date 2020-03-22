import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { ExperimentService } from '../../../services/experiment-service';
import { OverlayService } from '../../../services/overlay-service';
import { ModalComponent } from '../../modal/modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { Experiment } from '../../../../../shared/models';


@Component({
  selector: 'app-delete-experiment',
  templateUrl: './delete-experiment.component.html'
})
export class DeleteExperimentComponent extends ModalComponent implements OnInit {

  @Input() id: number;
  experiment: Experiment;

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
    private experimentService: ExperimentService) {
    super(overlay, viewContainerRef, overlayService);
  }

  ngOnInit() {
    this.experiment = this.experimentService.get(this.id);
  }

  onYes(event: Event) {
    event.preventDefault();
    this.experimentService.delete(this.id);
    this.overlayService.close();
  }

  onNo(event: Event) {
    event.preventDefault();
    this.overlayService.close();
  }

}
