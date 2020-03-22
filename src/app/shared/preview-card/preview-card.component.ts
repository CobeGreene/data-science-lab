import { Component, OnInit, Input } from '@angular/core';
import { Feature } from '../../../../shared/models';

@Component({
  selector: 'app-preview-card',
  templateUrl: './preview-card.component.html',
})
export class PreviewCardComponent implements OnInit {

  @Input() feature: Feature;
  @Input() value: any;

  constructor() { }

  ngOnInit() {
  }

}
