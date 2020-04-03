import { Component, OnInit, Input, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { DropdownComponent } from '../../dropdown/dropdown.component';
import { Visual } from '../../../../../shared/models';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';
import { VisualizationService } from '../../../services/visualization-service/visualization.service';

@Component({
  selector: 'app-rename-visual',
  templateUrl: './rename-visual.component.html'
})
export class RenameVisualComponent extends DropdownComponent implements OnInit {

  @Input() id: number;


  name: string;
  @ViewChild('inputCmp', { static: true }) inputComponent: ElementRef<HTMLInputElement>;

  constructor(overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
    private visualService: VisualizationService) {
    super(overlay, viewContainerRef, overlayService);
  }
  
  ngOnInit() {
    this.name = this.visualService.get(this.id).name;
  }
  
  onOpen(..._: any) {
    this.name = this.visualService.get(this.id).name;
  }

  onEnter() {
    this.visualService.rename(this.id, this.name);    
    this.overlayService.close();
  }

  focus() {
    this.inputComponent.nativeElement.focus();
  }

}
