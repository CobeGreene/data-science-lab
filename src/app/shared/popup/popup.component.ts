import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { OverlayComponent } from '../overlay/overlay.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../services/overlay-service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent extends OverlayComponent implements OnInit {

  message: string;
  className = '';

  private timeout: NodeJS.Timer;

  @ViewChild('popupCmp', { static: false }) popupComponent: TemplateRef<void>;

  constructor(overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService) {
    super(overlay, viewContainerRef, overlayService);
  }
  templateRef() {
    return this.popupComponent;
  }

  positionStrategy({ x, y }: MouseEvent, _message: string, _className: string) {
    return this.overlay.position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
        }
      ]);
  }

  ngOnInit() {
  }

  onOpen(message: string, className: string) {
    this.message = message;
    this.className = className;
    this.timeout = setTimeout(() => {
      this.overlayService.close();
    }, 2000);
  }

  onClose() {
    clearTimeout(this.timeout);
  }


}
