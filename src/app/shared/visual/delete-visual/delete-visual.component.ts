import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { Visual } from '../../../../../shared/models';
import { VisualizationService } from '../../../services/visualization-service';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';

@Component({
  selector: 'app-delete-visual',
  templateUrl: './delete-visual.component.html'
})
export class DeleteVisualComponent extends ModalComponent implements OnInit {

  @Input() id: number;
  visual: Visual;

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
    private visualService: VisualizationService) {
    super(overlay, viewContainerRef, overlayService);
  }

  ngOnInit() {
    this.visual = this.visualService.get(this.id);  
  }
  
  onOpen() {
    this.visual = this.visualService.get(this.id);  
  }

  onYes(event: Event) {
    event.preventDefault();
    this.visualService.delete(this.id);
    this.overlayService.close();
  }
  
  onNo(event: Event) {
    event.preventDefault();
    this.overlayService.close();
  }


}
