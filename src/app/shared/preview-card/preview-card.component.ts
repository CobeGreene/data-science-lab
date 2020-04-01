import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { Feature } from '../../../../shared/models';
import { PreviewModalComponent } from './preview-modal/preview-modal.component';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.component.html',
})
export class PreviewCardComponent implements OnInit {
  
  @Input() feature: Feature;
  
  @Input() value: any;

  @ViewChild('modalCmp', { static: false }) modalComponent: PreviewModalComponent;

  constructor() { }

  @HostListener('click', ['$event']) onClick(event) {
    this.modalComponent.open(event);
  }

  ngOnInit() {
  }

}
