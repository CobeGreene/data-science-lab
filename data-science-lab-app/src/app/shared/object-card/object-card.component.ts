import { Component, OnInit, Input } from '@angular/core';
import { Feature } from '../../../../shared/models';

@Component({
  selector: 'app-object-card',
  templateUrl: './object-card.component.html',
  styleUrls: ['./object-card.component.css']
})
export class ObjectCardComponent implements OnInit {

  @Input() object: Feature;

  constructor() { }

  ngOnInit() {
  }

}
