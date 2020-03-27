import { Component, OnInit, ViewContainerRef, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { DropdownComponent } from '../../dropdown/dropdown.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';
import { RenameFeatureComponent } from './rename-feature/rename-feature.component';

@Component({
  selector: 'app-dropdown-feature',
  templateUrl: './dropdown-feature.component.html',
})
export class DropdownFeatureComponent extends DropdownComponent implements OnInit {

  respectTo: ElementRef;

  @Input() id: number;
  @Input() index: number;

  @ViewChild('renameDropdown', { static: false }) renameDropdown: DropdownComponent;
  @ViewChild('renameCmp', { static: false }) renameComponent: RenameFeatureComponent;

  constructor(overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService) {
    super(overlay, viewContainerRef, overlayService);
  }

  onOpen(respectTo: ElementRef) {
    this.respectTo = respectTo;
  }

  onRename(event: MouseEvent) {
    this.renameDropdown.open(event, this.respectTo);
    this.renameComponent.focus();
  }


}
