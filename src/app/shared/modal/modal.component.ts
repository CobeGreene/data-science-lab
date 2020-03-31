import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../services/overlay-service';
import { OverlayComponent } from '../overlay/overlay.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent extends OverlayComponent {

  @ViewChild('overlayCmp', { static: false }) overlayComponent: TemplateRef<void>;

  constructor(overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService) {
    super(overlay, viewContainerRef, overlayService);
  }

  protected onOpen(..._:any) {

  }

  protected onClose() {

  }

  templateRef() {
    return this.overlayComponent;
  }

  positionStrategy(_: MouseEvent) {
    return this.overlay.position().global()
      .centerHorizontally().centerVertically();
  }

}
