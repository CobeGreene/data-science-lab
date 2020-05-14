import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Visual } from '../../../../../shared/models';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';
import { VisualizationService } from '../../../services/visualization-service/visualization.service';
import { ModalComponent } from '../../modal/modal.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-rename-visual',
  templateUrl: './rename-visual.component.html'
})
export class RenameVisualComponent extends ModalComponent implements OnInit {

  @Input() id: number;

  visual: Visual;

  @ViewChild('renameForm', { static: false }) renameForm: NgForm;

  constructor(overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
    private visualService: VisualizationService) {
    super(overlay, viewContainerRef, overlayService);
  }
  
  ngOnInit() {
    this.visual = Object.assign({}, this.visualService.get(this.id));
  }
  
  onOpen(..._: any) {
    this.visual = Object.assign({}, this.visualService.get(this.id));
  }

  onSubmit(_: Event) {
    this.visualService.rename(this.id, this.visual.name);    
    this.overlayService.close();
  }

  onCancel() {
    this.overlayService.close();
  }

}
