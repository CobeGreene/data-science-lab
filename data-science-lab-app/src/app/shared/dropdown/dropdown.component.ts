import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { OverlayComponent } from '../overlay/overlay.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../services/overlay-service';


@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent extends OverlayComponent implements OnInit {

  @ViewChild('dropdownCmp', { static: false }) dropdownComponent: TemplateRef<void>;

  constructor(overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService) {
    super(overlay, viewContainerRef, overlayService);
  }

  templateRef() {
    return this.dropdownComponent;
  }

  positionStrategy({ x, y }: MouseEvent, respectTo?: ElementRef) {
    if (respectTo !== undefined) {
      return this.overlay.position()
        .flexibleConnectedTo(respectTo)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        }, {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        }]);
    }
    return this.overlay.position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        }
      ]);
  }

  onOpen(..._: any) {

  }

  onClose() {

  }

  ngOnInit() {
  }

}
