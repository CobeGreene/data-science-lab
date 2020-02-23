import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Experiment } from '../../../../../shared/models';
import { NgForm } from '@angular/forms';
import { DeleteExperimentComponent } from '../delete-experiment/delete-experiment.component';
import { ModalComponent } from '../../modal/modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';
import { ExperimentService } from '../../../services/experiment-service';

@Component({
  selector: 'app-update-experiment',
  templateUrl: './update-experiment.component.html',
  styleUrls: ['./update-experiment.component.css']
})
export class UpdateExperimentComponent extends ModalComponent implements OnInit {

  @Input() id: number;
  experiment: Experiment;
  editMode = false;

  @ViewChild('updateForm', { static: false }) updateForm: NgForm;

  @ViewChild('deleteCmp', { static: false }) deleteComponent: DeleteExperimentComponent;

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
    private experimentService: ExperimentService) {
    super(overlay, viewContainerRef, overlayService);
  }

  onOpen() {
    this.editMode = false;
    this.experiment = {...this.experimentService.get(this.id)};
  }

  ngOnInit() {
    this.editMode = false;
    this.experiment = {...this.experimentService.get(this.id)};
  }

  onToggleUpdate() {
    this.editMode = !this.editMode;
    this.experiment = {...this.experimentService.get(this.id)};
  }

  onSubmit(_: Event) {
    this.experimentService.update(this.experiment.id, this.experiment.title, this.experiment.description);
    this.overlayService.close();
  }

  onDelete(event: MouseEvent) {
    this.deleteComponent.open(event);
  }

}
