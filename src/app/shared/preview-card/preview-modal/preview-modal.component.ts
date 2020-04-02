import { Component, OnInit, Input } from '@angular/core';
import { Feature } from '../../../../../shared/models';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-preview-modal',
  templateUrl: './preview-modal.component.html',
  styleUrls: ['./preview-modal.component.css']
})
export class PreviewModalComponent extends ModalComponent {

  @Input() feature: Feature;
  @Input() value: any;


}
